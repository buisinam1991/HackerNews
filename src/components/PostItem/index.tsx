import { TouchableOpacity, View, Text, StyleSheet, ImageBackground } from "react-native";
import { Story } from "../../types";
import Colors from "../../constant";

interface PostItemProps {
  item: Story;
  onPress: () => void;
}

const PostItem: React.FC<PostItemProps> = ({ item, onPress }) => (
  <TouchableOpacity onPress={() => onPress()} style={styles.itemContainer}>
    <View style={styles.detailsContainer}>
      <>{!item?.title && console.log(item)}</>
      <Text style={styles.title}>{item?.title}</Text>
      {/* <Text style={styles.url}>{new URL(item.url).hostname}</Text> */}
      <View style={styles.metaContainer}>
      <View style={styles.scoreContainer}>
        <Text style={styles.score}>{item?.score}</Text>
      </View>
        <Text style={styles.metaText}>by {item?.by}</Text>
        <Text style={styles.metaText}>|</Text>
        <Text style={styles.metaText}>{new Date(item?.time * 1000).toLocaleTimeString()}</Text>
      </View>
    </View>
    <ImageBackground style={styles.commentContainer} source={require('../../images/ic_comment.png')}
      resizeMode="contain">
      <Text style={styles.commentCount}>{item?.kids ? item.kids.length : 0}</Text>
    </ImageBackground>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center',
    backgroundColor: "transparent"
  },
  scoreContainer: {
    padding: 5,
    borderRadius: 50,
    marginRight: 10,
    backgroundColor: Colors.mainColor
  },
  score: {
    fontSize: 8,
    fontWeight: 'bold',
    color: "white"
  },
  detailsContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  url: {
    fontSize: 14,
    color: '#828282',
  },
  metaContainer: {
    flexDirection: 'row',
    marginTop: 5,
    alignItems: "center"
  },
  metaText: {
    fontSize: 12,
    color: '#828282',
    marginRight: 5,
  },
  commentContainer: {
    padding: 8,
    borderRadius: 5,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start"
  },
  commentCount: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#ff6600',
    marginBottom: 5
  },
});

export default PostItem;

