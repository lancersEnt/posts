
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class CreatePostInput {
    content: string;
    authorId: string;
    createdAt?: Nullable<DateTime>;
}

export class UpdatePostInput {
    content?: Nullable<string>;
    authorId?: Nullable<string>;
    updatedAt?: Nullable<DateTime>;
}

export class Post {
    id: string;
    content: string;
    authorId: string;
    user?: Nullable<User>;
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
}

export class User {
    id: string;
    posts?: Nullable<Post[]>;
}

export type DateTime = any;
type Nullable<T> = T | null;
