
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class CreatePostInput {
    content: string;
    imageUrl?: Nullable<string>;
    authorId: string;
    createdAt?: Nullable<DateTime>;
}

export class UpdatePostInput {
    content?: Nullable<string>;
    imageUrl?: Nullable<string>;
    authorId?: Nullable<string>;
    updatedAt?: Nullable<DateTime>;
}

export class User {
    id: string;
    posts?: Nullable<Post[]>;
}

export class Post {
    id: string;
    content: string;
    imageUrl?: Nullable<string>;
    authorId: string;
    user?: Nullable<User>;
    likersIds?: Nullable<Nullable<string>[]>;
    likers?: Nullable<Nullable<User>[]>;
    createdAt?: Nullable<DateTime>;
    updatedAt?: Nullable<DateTime>;
}

export abstract class IQuery {
    abstract posts(): Nullable<Post>[] | Promise<Nullable<Post>[]>;

    abstract post(id: string): Nullable<Post> | Promise<Nullable<Post>>;

    abstract userPosts(id: string): Nullable<Post>[] | Promise<Nullable<Post>[]>;
}

export abstract class IMutation {
    abstract createPost(createPostInput: CreatePostInput): Post | Promise<Post>;

    abstract updatePost(id: string, updatePostInput: UpdatePostInput): Post | Promise<Post>;

    abstract removePost(id: string): Nullable<Post> | Promise<Nullable<Post>>;

    abstract likePost(postId: string): Nullable<boolean> | Promise<Nullable<boolean>>;

    abstract unlikePost(postId: string): Nullable<boolean> | Promise<Nullable<boolean>>;
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
