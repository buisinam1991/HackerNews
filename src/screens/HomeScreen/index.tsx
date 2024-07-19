import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Dimensions, SafeAreaView } from 'react-native';
import axios from 'axios';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { useNavigation } from '@react-navigation/native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { Story } from '../../types';
import PostItem from '../../components/PostItem';
import Colors from '../../constant';

const PAGE_NUM = 10;

const HomeScreen = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [page, setPage] = useState(1);
  const [segmentIndex, setSegmentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const navigation = useNavigation();

  const segments = ['newstories', 'beststories', 'topstories'];

  useEffect(() => {
    if(!loadingMore){
      fetchStories();
    }
  }, [page, segmentIndex]);

  const fetchStories = async () => {
    setLoading(page === 1);
    setLoadingMore(page !== 1);
    try {
      const response = await axios.get(`https://hacker-news.firebaseio.com/v0/${segments[segmentIndex]}.json`);
      const storyIds = response.data.slice((page - 1) * PAGE_NUM, page * PAGE_NUM);
      const storyPromises = storyIds.map((id: number) =>
        axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
      );
      const storyResponses = await Promise.all(storyPromises);
      setStories((prevStories) => page === 1 ? storyResponses.map((res) => res.data) : [...prevStories, ...storyResponses.map((res) => res.data)]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreStories = () => {
    setPage(page + 1);
  };

  const handleSegmentChange = (index: number) => {
    setSegmentIndex(index);
    setPage(1);
    setStories([]);
  };

  const renderItem = ({ item }: { item: Story }) => <PostItem item={item} onPress={() => navigation.navigate('Details', { item })} key={item.id.toString()}/>
  
  const renderSkeletonItem = () => (
    <>
      {[...Array(PAGE_NUM)].map((_, index) => (<SkeletonPlaceholder>
        <SkeletonPlaceholder.Item flexDirection="row" alignItems="center" marginVertical={10} key={index}>
          <SkeletonPlaceholder.Item width={Dimensions.get("screen").width - 20} height={100} borderRadius={4} backgroundColor="grey" marginHorizontal={10}/>
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>))}
    </>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return renderSkeletonItem();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SegmentedControl
        values={['New', 'Best', 'Top']}
        selectedIndex={segmentIndex}
        onChange={(event) => handleSegmentChange(event.nativeEvent.selectedSegmentIndex)}
        style={{ margin: 10}}
        tintColor="white"
        fontStyle={{color: Colors.mainColor}}
      />
      {loading ? (
        renderSkeletonItem()
      ) : (
        <FlatList
          data={stories}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          onEndReached={loadMoreStories}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
});

export default HomeScreen;
