import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions, Linking, ScrollView } from 'react-native';
import axios from 'axios';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { Comment } from '../../types';
import CommentItem from '../../components/CommentItem';
import RenderHtml from 'react-native-render-html';

const { width } = Dimensions.get('window');

const DetailsScreen = ({ route }: { route: any }) => {
  const { item } = route.params;
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);

  const PAGE_NUM = 10;

  useEffect(() => {
    fetchComments(item.kids || [], page);
  }, [item, page]);

  const fetchComments = async (commentIds: number[], page: number) => {
    setLoading(page === 1);
    setLoadingMore(page !== 1);
    try {
      const start = (page - 1) * PAGE_NUM;
      const end = page * PAGE_NUM;
      const commentPromises = commentIds.slice(start, end).map((id) =>
        axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
      );
      const commentResponses = await Promise.all(commentPromises);
      setComments((prevComments) =>
        page === 1 ? commentResponses.map((res) => res.data) : [...prevComments, ...commentResponses.map((res) => res.data)]
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreComments = () => {
    setPage(page + 1);
  };

  const renderItem = ({ item }: { item: any }) => <CommentItem comment={item} />;

  const renderSkeletonItem = () => (
    <>
      {[...Array(PAGE_NUM)].map((_, index) => (
        <SkeletonPlaceholder key={index}>
          <SkeletonPlaceholder.Item
            flexDirection="row"
            alignItems="center"
            marginVertical={10}
          >
            <SkeletonPlaceholder.Item
              width={width - 20}
              height={60}
              borderRadius={4}
              marginHorizontal={10}
            />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
      ))}
    </>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return renderSkeletonItem();
  };

  return (
    <ScrollView style={styles.container}>
        <FlatList
          data={comments}
          ListHeaderComponent={
            <>
              <Text style={styles.title}>{item.title}</Text>
              <RenderHtml contentWidth={width} source={{ html: item.text }} />
                {item.url ? (
                <Text style={styles.url} onPress={() => Linking.openURL(item.url)}>
                  Sources
                </Text>
              ) : null}
              <View style={styles.infoContainer}>
                <Text style={styles.infoText}>Score: {item.score}</Text>
                <Text style={styles.infoText}>By: {item.by}</Text>
                <Text style={styles.infoText}>Time: {new Date(item.time * 1000).toLocaleString()}</Text>
              </View>
            </>
          }
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          onEndReached={loadMoreComments}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
        />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  url: {
    fontSize: 16,
    color: '#1e90ff',
    marginBottom: 20,
    textDecorationLine: 'underline',
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 5,
  },
  commentContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});

export default DetailsScreen;
