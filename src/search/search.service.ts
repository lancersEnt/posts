import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Post } from 'src/graphql';
import { PostSearchBody } from 'src/utils/interfaces/PostSearchBody.interface';
import { PostSearchResult } from 'src/utils/interfaces/PostSearchResult';

@Injectable()
export default class SearchService {
  index = 'posts';

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async indexPost(post: Post) {
    // Check if a document with the same post.id exists
    const existingPost = await this.elasticsearchService.search({
      index: this.index,
      body: {
        query: {
          match: {
            id: post.id,
          },
        },
      },
    });

    if (existingPost.body.hits.total.value > 0) {
      // Document with post.id exists, update it
      const existingDocumentId = existingPost.body.hits.hits[0]._id;
      return this.elasticsearchService.update<PostSearchResult>({
        index: this.index,
        id: existingDocumentId,
        body: {
          doc: {
            content: post.content,
            authorId: post.authorId,
          },
        },
      });
    } else {
      // Document with post.id does not exist, create a new one
      return this.elasticsearchService.index<PostSearchResult, PostSearchBody>({
        index: this.index,
        body: {
          id: post.id,
          content: post.content,
          authorId: post.authorId,
        },
      });
    }
  }

  async search(text: string) {
    try {
      const keywords = text.split(' '); // Split the input text into keywords

      const shouldQueries = keywords.map((keyword) => ({
        wildcard: {
          content: `*${keyword}*`,
        },
      }));

      const response = await this.elasticsearchService.search({
        index: this.index,
        body: {
          query: {
            bool: {
              should: shouldQueries, // Any of the keywords can match
              minimum_should_match: 1, // At least one keyword must match
            },
          },
          sort: [
            {
              _score: { order: 'desc' }, // Sort by _score in descending order (closest match first)
            },
          ],
        },
      });

      // Check if the search request was successful
      if (response.statusCode === 200) {
        // Extract and return search results from the response data
        return response.body.hits.hits.map((hit) => hit._source);
      } else {
        // Handle search error
        console.error('Failed to execute the search query:', response.body);
        return [];
      }
    } catch (error) {
      // Handle exceptions
      console.error('Error executing the search query:', error);
      return [];
    }
  }
}
