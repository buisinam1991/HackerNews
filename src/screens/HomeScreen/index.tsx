import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Dimensions, SafeAreaView } from 'react-native';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { useNavigation } from '@react-navigation/native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { Story } from '../../types';
import PostItem from '../../components/PostItem';
import Colors from '../../constant';
import { fetchStoryById, fetchStoryIds } from '../../api';
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
    if (!loadingMore) {
      fetchStories();
    }
  }, [page, segmentIndex]);

  const fetchStories = async () => {
    setLoading(page === 1);
    setLoadingMore(page !== 1);
    try {
      const storyIds = await fetchStoryIds(segments[segmentIndex]);
      const paginatedStoryIds = storyIds.slice((page - 1) * PAGE_NUM, page * PAGE_NUM);
      const storyPromises = paginatedStoryIds.map((id: number) => fetchStoryById(id));
      const storyResponses = await Promise.all(storyPromises);
      setStories((prevStories) => page === 1 ? storyResponses : [...prevStories, ...storyResponses]);
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

  const renderItem = ({ item }: { item: Story }) => (
    <PostItem item={item} onPress={() => navigation.navigate('Details', { item })} key={item?.id?.toString()} />
  );

  const renderSkeletonItem = () => (
    <>
      {[...Array(PAGE_NUM)].map((_, index) => (
        <SkeletonPlaceholder key={index}>
          <SkeletonPlaceholder.Item flexDirection="row" alignItems="center" marginVertical={10}>
            <SkeletonPlaceholder.Item
              width={Dimensions.get("screen").width - 20}
              height={100}
              borderRadius={4}
              backgroundColor="grey"
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
    <SafeAreaView style={{ flex: 1 }}>
      <SegmentedControl
        values={['New', 'Best', 'Top']}
        selectedIndex={segmentIndex}
        onChange={(event) => handleSegmentChange(event.nativeEvent.selectedSegmentIndex)}
        style={{ margin: 10 }}
        tintColor="white"
        fontStyle={{ color: Colors.mainColor }}
      />
      {loading ? (
        renderSkeletonItem()
      ) : (
        <FlatList
          data={stories}
          keyExtractor={(item) => item?.id?.toString()}
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

export default HomeScreen;
