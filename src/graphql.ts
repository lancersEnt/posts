
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class CreatePostInput {
    content: string;
    type: string;
    videoUrl?: Nullable<string>;
    documentUrl?: Nullable<string>;
    imageUrl?: Nullable<string>;
    postId?: Nullable<string>;
    kladId?: Nullable<string>;
    authorId: string;
    createdAt?: Nullable<DateTime>;
}

export class UpdatePostInput {
    content?: Nullable<string>;
    type?: Nullable<string>;
    videoUrl?: Nullable<string>;
    documentUrl?: Nullable<string>;
    imageUrl?: Nullable<string>;
    authorId?: Nullable<string>;
    updatedAt?: Nullable<DateTime>;
}

export class User {
    id: string;
    posts?: Nullable<Post[]>;
}

export class Klad {
    id: string;
}

export class Post {
    id: string;
    content: string;
    type: string;
    videoUrl?: Nullable<string>;
    documentUrl?: Nullable<string>;
    imageUrl?: Nullable<string>;
    postId?: Nullable<string>;
    kladId?: Nullable<string>;
    authorId: string;
    user?: Nullable<User>;
    likersIds?: Nullable<Nullable<string>[]>;
    likers?: Nullable<Nullable<User>[]>;
    subscribersIds?: Nullable<Nullable<string>[]>;
    subscribers?: Nullable<Nullable<User>[]>;
    shares?: Nullable<number>;
    createdAt?: Nullable<DateTime>;
    updatedAt?: Nullable<DateTime>;
    post?: Nullable<Post>;
    klad?: Nullable<Klad>;
}

export abstract class IQuery {
    abstract posts(): Nullable<Post>[] | Promise<Nullable<Post>[]>;

    abstract post(id: string): Nullable<Post> | Promise<Nullable<Post>>;

    abstract userPosts(id: string): Nullable<Post>[] | Promise<Nullable<Post>[]>;

    abstract feed(page: number): Nullable<Feed> | Promise<Nullable<Feed>>;
}

export abstract class IMutation {
    abstract createPost(createPostInput: CreatePostInput): Post | Promise<Post>;

    abstract updatePost(id: string, updatePostInput: UpdatePostInput): Post | Promise<Post>;

    abstract removePost(id: string): Nullable<Post> | Promise<Nullable<Post>>;

    abstract likePost(postId: string): Nullable<Post> | Promise<Nullable<Post>>;

    abstract unlikePost(postId: string): Nullable<Post> | Promise<Nullable<Post>>;
}

export class Feed {
    count?: Nullable<number>;
    posts: Nullable<Post>[];
}

export class Result {
    newPost?: Nullable<Post>;
}

export class PostLikedResult {
    post?: Nullable<Post>;
}

export abstract class ISubscription {
    abstract postCreated(): Nullable<Result> | Promise<Nullable<Result>>;

    abstract postLiked(): Nullable<PostLikedResult> | Promise<Nullable<PostLikedResult>>;

    abstract postUnliked(): Nullable<PostLikedResult> | Promise<Nullable<PostLikedResult>>;
}

export type DateTime = any;
export type GraphQLUpload = any;
type Nullable<T> = T | null;
