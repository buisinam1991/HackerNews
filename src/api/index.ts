import axios from 'axios';
import { Comment, Story } from '../types';

const BASE_URL = 'https://hacker-news.firebaseio.com/v0';

export const fetchStoryIds = async (type: string): Promise<number[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/${type}.json`);
    return response.data;
  } catch (error) {
    console.error('Error fetching story IDs:', error);
    throw error;
  }
};

export const fetchStoryById = async (id: number): Promise<Story> => {
  try {
    const response = await axios.get(`${BASE_URL}/item/${id}.json`);
    return response.data;
  } catch (error) {
    console.error('Error fetching story by ID:', error);
    throw error;
  }
};

export const fetchComments = async (commentIds: number[], page: number, pageSize: number): Promise<Comment[]> => {
  try {
    const start = (page - 1) * pageSize;
    const end = page * pageSize;
    const commentPromises = commentIds.slice(start, end).map((id) =>
      axios.get(`${BASE_URL}/item/${id}.json`)
    );
    const commentResponses = await Promise.all(commentPromises);
    return commentResponses.map((res) => res.data);
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

export const fetchSubcomments = async (commentIds: number[]): Promise<Comment[]> => {
  try {
    const commentPromises = commentIds.map((id) =>
      axios.get(`${BASE_URL}/item/${id}.json`)
    );
    const commentResponses = await Promise.all(commentPromises);
    return commentResponses.map((res) => res.data);
  } catch (error) {
    console.error('Error fetching subcomments:', error);
    throw error;
  }
};
