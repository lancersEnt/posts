import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import axios from 'axios';
import { log } from 'console';
import { Post } from 'src/graphql';
import { PostSearchBody } from 'src/utils/interfaces/PostSearchBody.interface';

@Injectable()
export default class SearchService {
  index = 'posts';

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async indexData(indexName: string, id: string, data: any) {
    return await this.elasticsearchService.index({
      index: indexName,
      id: id,
      body: data,
    });
  }

  async indexPost(post: Post) {
    const { id, authorId, content } = post;

    // Define the document body to be indexed
    const document = {
      id,
      authorId,
      content,
    };
    try {
      const response = await axios.post(
        `http://localhost:9200/${this.index}/_doc/${id}`,
        document,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      return response;
    } catch (error) {
      error(error.message);
    }
  }

  async search(text: string) {
    try {
      // Send the Elasticsearch search request using axios with explicit Content-Type header
      const response = await axios.get(
        `http://localhost:9200/${this.index}/_search`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          params: {
            q: `content:*${text}*`, // Customize your search query here
          },
        },
      );

      // Check if the search request was successful
      if (response.status === 200) {
        // Extract and return search results from the response data
        return response.data.hits.hits.map((hit) => hit._source);
      } else {
        // Handle search error
        console.error('Failed to execute the search query:', response.data);
        return [];
      }
    } catch (error) {
      // Handle exceptions
      console.error('Error executing the search query:', error);
      return [];
    }
  }
}
