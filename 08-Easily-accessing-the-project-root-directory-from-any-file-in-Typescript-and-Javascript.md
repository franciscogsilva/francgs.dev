
# Easily accessing the project root directory from any file in Typescript and Javascript

## Problem Statement

In TypeScript projects, consistently accessing the project's root directory from various subdirectories can be challenging. Relative paths may vary depending on the current file's location, leading to potential issues in path management.

## Solution

We will modify the `app.ts` file in the root of your TypeScript project to export a `basePath` constant. This constant will hold the absolute path to the project's root directory. By importing `basePath` in any part of the application, you can easily reference the root directory.

## Step-by-Step Guide

### 1. Modifying the `app.ts` File

Open your `app.ts` file, which is typically in the root of your TypeScript project. Add the following line of code at the end of the file:

```typescript
import path from 'path';
// Here you can play with '..' depends where you locate the following line
export const basePath: string = path.join(path.resolve(__dirname), "..");
```

This line exports a `basePath` constant, which computes the absolute path to the project's root directory.

### 2. Using `basePath` in Your Application

You can now import the `basePath` variable in any TypeScript file within your project to reference the root directory. For example:

```typescript
import { basePath } from './app';

// Use basePath to reference any file or directory from the project root
const someFilePath = path.join(basePath, 'path/to/your/file');
```

## Conclusion

By adding a single line of code to the `app.ts` file and exporting `basePath`, we have created a straightforward and efficient way to access the project's root directory from anywhere in our TypeScript application. This method enhances the manageability and readability of our code, especially when dealing with file paths.
