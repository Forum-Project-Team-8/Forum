## Forum 
## Forum management System


## Project Description

Design and implement a Forum System, where the users can create posts, add comments, and upvote/downvote the things that they like or dislike the most. Choose what your forum will be about and stick with it. Examples: an automotive fanbase forum, java technical learning forum, crypto trading forum, fashion forum, etc. The forum should revolve around one or two general topics.

### Functional Requirements

Entities (documents)
- Authentication is handled by Firebase, there is no need for auth entity
- Each user must have a first and last name, email and/or username
    - First name and last name must be between 4 and 32 symbols.
    - Email must be a valid email and unique in the system.
- Each admin must have a first and last name, email, and may have a phone number.
    - First name and last name must be between 4 and 32 symbols.
    - Email must be a valid email and unique in the system.
- Each post must have a user who created it, a title, content, comments and how many likes it has received.
    - The title must be between 16 and 64 symbols.
    - The content must be between 32 symbols and 8192 symbols.
    - The post must have a user who created it.
    - Other users must be able to post replies.

### Public Part

The public part must be accessible without authentication.

On the home page, anonymous users must be presented with the core features of the platform as well as how many people are using it and how many posts have been created so far.

Anonymous users must be able to register and log in.

Anonymous users should be able to see a list of the top 10 most commented posts and a list of the 10 most recently created posts.

### Private Part

Accessible only if the user is authenticated.

The user must be able to log in and log out.

Users must be able to browse posts created by the other users with an option to sort and filter them.

Users must be able to view a single post including its title, content, comments, likes, etc. The details of the post and any available user actions (comment/like/edit) should be presented on the same page.

Users must be able to update their profile information. Users should not be able to change their username once registered. Users could upload a profile photo.

Users must be able to create a new post with at least a title and content.

Each user must be able to edit only personal posts or comments.

Each user must be able to view all their or any other user’s posts and comments (with the option to filter and sort them).

Each user must be able to remove one or more of their own posts. Deleting a post should be available while reading the details of an individual post or when browsing the list of all posts.

Each user must be able to comment/reply to any other forum post.

### Administrative Part

Accessible to users with administrative privileges.

Admin must be able to search for a user by their username, email, or display name.

Admin must be able to block or unblock individual users. A blocked user must not be able to create posts or comments.

Admin must be able to delete any post.

Admin must be able to view a list of all posts with an option to filter and sort them.

### Optional Feature

Post Tags – In order for the users to navigate easier and find certain topics faster, you can implement tags. A tag is additional information that can be put under each post after creating the post. The process of adding a tag/s to a post is as follows: The user creates a post, then proceeds to edit the post, once on the edit post page, the user can add a tag/s under it. If the tag does not exist, a new one must be added to the database. If the tag exists, a new one must not be created, the one already in the database must be reused. All tags should be lowercase only.

After the post is tagged, other users can find it by typing in the tag in the search bar. For example: your forum is about cars, a post is marked with the tags: “mercedes” and “tuning,” when “mercedes” is typed in the search bar, all posts that are tagged with “mercedes” should appear in the front-end.

A User must be able to add/remove/edit tags only on its own posts. Admins must be able to add/remove/edit tags on all posts.

### Firebase Realtime Database

All data should be stored in the document (NoSQL) database hosted by Google Firebase. You must think of a way to organize your documents to achieve the functionalities described above.

### Use Cases

#### Scenario 1

A friend of Pavel’s told him about this amazing forum, where lots of people share their ideas and perspectives on the crypto/stock market. Pavel enters the website and sees a feed of posts. He can sort them by most liked or newest. He can also filter them by a certain word/s. He is an anonymous user so he cannot create a post yet. He registers and then logs in to the forum. He can now start sharing his ideas with his buddy crypto “holders.”

#### Scenario 2

Your forum has accumulated thousands of new users. Most of them are proactively helpful and positive, but some of them started posting spam or/and irrelevant information to the forum. You hire a moderator. You instruct the moderator to enter the forum and create a first-time registration. You as an admin give admin rights to your moderator through the forum. They can now start deleting posts and ban users that do not follow the forum rules!

### Technical Requirements

General
- Follow OOP principles when coding (if and when applicable)
- Follow KISS, SOLID, DRY principles when coding
- Follow the functional programming principles (use pure functions, avoid side effects, make use of array methods and higher-order functions where applicable)
- Use tiered project structure (separate the application in layers)

### Firebase Realtime Database Structure for Post
```
{
    "posts": {
        "-NxlbuzUI-GpothBLD3D": {
            "author": "miss_stanislava",
            "content": "Здравейте , интересува ме какво е времето в Мавриций през октомври месец , дали тогава е дъждовния период или ще сме в началото на лятото ?",
            "createdOn": "Mon May 13 2024 14:04:10 GMT+0300 (Eastern European Summer Time)",
            "likedBy": {
                "0": "miss_stanislava",
                "anjin": true,
                "miss_stanislava": true
            },
            "tags": {
                "0": "Мавриций"
            },
            "title": "Мавриций"
        },
        // ...
    }
}

```
### Instructions to Run the Project

1. Clone the repository to your local machine.
2. Navigate to the project directory: `/l:/Teleric One/OneDrive - Telerik Academy/Desktop/Forum A58/Forum/main`.
3. Install the project dependencies by running the following command:
    ```
    npm install
    ```
4. Create a Firebase project and set up the Firebase Realtime Database.
5. Configure the Firebase credentials in the project. You can do this by creating a `.env` file in the project root directory and adding the following environment variables:
    ```
    FIREBASE_API_KEY=<your-firebase-api-key>
    FIREBASE_AUTH_DOMAIN=<your-firebase-auth-domain>
    FIREBASE_DATABASE_URL=<your-firebase-database-url>
    FIREBASE_PROJECT_ID=<your-firebase-project-id>
    FIREBASE_STORAGE_BUCKET=<your-firebase-storage-bucket>
    FIREBASE_MESSAGING_SENDER_ID=<your-firebase-messaging-sender-id>
    FIREBASE_APP_ID=<your-firebase-app-id>
    ```
    Replace `<your-firebase-...>` with your actual Firebase project credentials.
6. Start the development server by running the following command:
    ```
    npm run dev
    ```
7. Open your browser and navigate to `http://localhost:3000` to access the application.

Note: Make sure you have Node.js and npm installed on your machine before running the project.