import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ActivityIndicator } from 'react-native';
import RenderHtml from 'react-native-render-html';
import axios from 'axios';
import { Comment } from '../../types';

const { width } = Dimensions.get('window');

interface CommentItemProps {
  comment: Comment;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
  const [subcomments, setSubcomments] = useState<Comment[]>([]);
  const [loadingSubcomments, setLoadingSubcomments] = useState(false);

  useEffect(() => {
    if (comment?.kids && comment?.kids?.length > 0) {
      fetchSubcomments(comment!!.kids);
    }
  }, [comment?.kids]);

  const fetchSubcomments = async (commentIds: number[]) => {
    setLoadingSubcomments(true);
    try {
      const commentPromises = commentIds.map((id) =>
        axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
      );
      const commentResponses = await Promise.all(commentPromises);
      setSubcomments(commentResponses.map((res) => res.data));
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingSubcomments(false);
    }
  };

  return (
    <View style={[styles.commentContainer,(comment?.kids && comment?.kids?.length > 0) && {borderWidth: 1,
      borderColor: '#ddd'}]}>
      <View style={styles.commentHeader}>
        {/* Replace 'userAvatar' with actual avatar URL if available */}
        {/* <Image source={{ uri: 'userAvatar' }} style={styles.avatar} /> */}
        <Text style={styles.username}>{comment?.by}</Text>
        <Text style={styles.time}>{new Date(comment?.time * 1000).toLocaleString()}</Text>
      </View>
      <View style={styles.commentBody}>
        <RenderHtml contentWidth={width} source={{ html: comment?.text }} />
      </View>
      <View style={styles.commentFooter}>
        {comment?.kids?.length!! > 0 && <Text style={styles.vote}>^ {comment?.kids ? comment!!.kids?.length : 0}</Text>}
        <Text style={styles.reply}>Reply</Text>
        <Text style={styles.report}>Report</Text>
      </View>
      {loadingSubcomments ? (
        <ActivityIndicator size="small" color="#0000ff" />
      ) : (
        subcomments.map((subcomment) => <CommentItem key={subcomment?.id} comment={subcomment} />)
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  commentContainer: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: 'transparent',
    borderRadius: 8,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontWeight: 'bold',
    marginRight: 10,
  },
  time: {
    color: '#666',
  },
  commentBody: {
    marginBottom: 10,
  },
  commentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  vote: {
    color: '#666',
  },
  reply: {
    color: '#1e90ff',
  },
  report: {
    color: '#1e90ff',
  },
  repliesContainer: {
    marginTop: 10,
    marginLeft: 20,
    borderLeftWidth: 1,
    borderLeftColor: '#ddd',
    paddingLeft: 10,
  },
});

export default CommentItem;
