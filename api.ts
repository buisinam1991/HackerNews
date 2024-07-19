import axios from 'axios';
import { Story } from './src/types';

const API_URL = 'https://hacker-news.firebaseio.com/v0/topstories.json';

const baseUrl = 'https://hacker-news.firebaseio.com/v0';
const storiesPerPage = 20; // Adjust as needed

// ... other interfaces and functions

// export const getTopStories = async (page: number = 1): Promise<Story[] | null> => {
//   try {
//     const storyIds = await getTopStoryIds();
//     const startIndex = (page - 1) * storiesPerPage;
//     const endIndex = startIndex + storiesPerPage;
//     const selectedIds = storyIds.slice(startIndex, endIndex);
//     const stories = await Promise.all(selectedIds.map(id => getStory(id)));
//     return stories.filter(story => story !== null) as Story[];
//   } catch (error) {
//     console.error('Error fetching stories:', error);
//     return null;
//   }
// };