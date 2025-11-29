import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
  FlatList,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/styles';
import { filterRecentPosts, getTimeAgo } from '../utils/timeUtils';
import { isPostLiked } from '../utils/socialInteractions';
import { ScreenLayout, ScreenContent, ScreenHeader, ScreenBody } from '../components/ScreenLayout';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// PostItem 컴포넌트 (RegionCategoryScreen 전용)
const PostItem = ({ item, index, onPress }) => {
  const [isLiked, setIsLiked] = useState(false);
  const imageUrl = item.imageUrl || item.images?.[0] || item.image;
  const likeCount = item.likes || item.likeCount || 0;

  useEffect(() => {
    const checkLike = async () => {
      const liked = await isPostLiked(item.id);
      setIsLiked(liked);
    };
    checkLike();
  }, [item.id]);

  return (
    <TouchableOpacity
      style={categoryStyles.postItem}
      onPress={() => onPress(item, index)}
      activeOpacity={0.9}
    >
      {/* 이미지 */}
      <View style={categoryStyles.postImageContainer}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={categoryStyles.postImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[categoryStyles.postImage, categoryStyles.postImagePlaceholder]}>
            <Ionicons name="image-outline" size={32} color={COLORS.textSubtle} />
          </View>
        )}

        {/* 우측 하단 하트 아이콘 */}
        <View style={categoryStyles.likeBadge}>
          <Ionicons
            name={isLiked ? 'heart' : 'heart-outline'}
            size={16} // text-base = 16px
            color={isLiked ? COLORS.error : COLORS.text}
          />
          <Text style={categoryStyles.likeCount}>{likeCount}</Text>
        </View>
      </View>

      {/* 이미지 밖 하단 텍스트 */}
      <View style={categoryStyles.postTextContainer}>
        <View style={categoryStyles.locationRow}>
          <Text style={categoryStyles.locationText} numberOfLines={1}>
            {item.detailedLocation || item.placeName || item.location || '여행지'}
          </Text>
          {item.time && (
            <Text style={categoryStyles.timeText}>{item.time}</Text>
          )}
        </View>
        {item.detailedLocation && item.detailedLocation !== item.location && (
          <Text style={categoryStyles.subLocationText} numberOfLines={1}>
            {item.location}
          </Text>
        )}
        {item.tags && item.tags.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={categoryStyles.tagsScroll}
            contentContainerStyle={categoryStyles.tagsScrollContent}
          >
            {item.tags.slice(0, 5).map((tag, tagIndex) => (
              <View key={tagIndex} style={categoryStyles.tagBadge}>
                <Text style={categoryStyles.tagText}>
                  #{typeof tag === 'string' ? tag.replace('#', '') : tag}
                </Text>
              </View>
            ))}
          </ScrollView>
        )}
        {item.note && (
          <Text style={categoryStyles.noteText} numberOfLines={2}>
            {item.note}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const RegionCategoryScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { regionName } = route.params || {};
  const { type } = route.params || {};
  const [activeTab, setActiveTab] = useState(type || 'realtime');
  const [displayedItems, setDisplayedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const pageRef = useRef(0);

  const [realtimeData, setRealtimeData] = useState([]);
  const [bloomingData, setBloomingData] = useState([]);
  const [spotsData, setSpotsData] = useState([]);
  const [foodData, setFoodData] = useState([]);

  const tabs = useMemo(() => [
    { id: 'realtime', label: '현지 실시간 정보' },
    { id: 'blooming', label: '개화정보' },
    { id: 'spots', label: '가볼만한 곳' },
    { id: 'food', label: '맛집 정보' }
  ], []);

  // 표시할 데이터 가져오기
  const getDisplayData = useCallback(() => {
    switch (activeTab) {
      case 'realtime':
        return realtimeData;
      case 'blooming':
        return bloomingData;
      case 'spots':
        return spotsData;
      case 'food':
        return foodData;
      default:
        return realtimeData;
    }
  }, [activeTab, realtimeData, bloomingData, spotsData, foodData]);

  // 시간을 숫자로 변환하는 함수 (정렬용)
  const timeToMinutes = (timeLabel) => {
    if (timeLabel === '방금') return 0;
    if (timeLabel.includes('분 전')) return parseInt(timeLabel);
    if (timeLabel.includes('시간 전')) return parseInt(timeLabel) * 60;
    if (timeLabel.includes('일 전')) return parseInt(timeLabel) * 24 * 60;
    return 999999;
  };

  // 지역 데이터 로드
  const loadRegionData = useCallback(async () => {
    try {
      setIsLoading(true);
      const allPostsJson = await AsyncStorage.getItem('uploadedPosts');
      let allPosts = allPostsJson ? JSON.parse(allPostsJson) : [];
      
      // 2일 이상 된 게시물 필터링
      allPosts = filterRecentPosts(allPosts, 2);
      
      const regionPosts = allPosts
        .filter(post => post.location?.includes(regionName) || post.location === regionName)
        .sort((a, b) => {
          const timeA = timeToMinutes(a.timeLabel || '방금');
          const timeB = timeToMinutes(b.timeLabel || '방금');
          return timeA - timeB;
        });

      if (regionPosts.length === 0) {
        setRealtimeData([]);
        setBloomingData([]);
        setSpotsData([]);
        setFoodData([]);
        return;
      }

      const realtimeFormatted = regionPosts.map((post) => ({
        id: `realtime-${post.id}`,
        images: post.images || [],
        videos: post.videos || [],
        image: post.images?.[0] || post.videos?.[0] || '',
        location: post.location,
        detailedLocation: post.detailedLocation || post.placeName || post.location,
        placeName: post.placeName,
        address: post.address,
        time: post.timeLabel || getTimeAgo(post.timestamp || post.createdAt || post.time),
        user: post.user || '여행자',
        category: post.category,
        categoryName: post.categoryName,
        aiLabels: post.aiLabels,
        tags: post.tags || post.aiLabels || [],
        note: post.note || post.content,
        likes: post.likes || post.likeCount || 0
      }));

      const bloomFormatted = regionPosts
        .filter(post => post.category === 'bloom')
        .map((post) => ({
          id: `bloom-${post.id}`,
          images: post.images || [],
          videos: post.videos || [],
          image: post.images?.[0] || post.videos?.[0] || '',
          location: post.location,
          detailedLocation: post.detailedLocation || post.placeName || post.location,
          placeName: post.placeName,
          address: post.address,
          time: post.timeLabel || getTimeAgo(post.timestamp || post.createdAt || post.time),
          user: post.user || '여행자',
          category: post.category,
          categoryName: post.categoryName,
          aiLabels: post.aiLabels,
          tags: post.tags || post.aiLabels || [],
          note: post.note || post.content,
          likes: post.likes || post.likeCount || 0
        }));

      const spotsFormatted = regionPosts
        .filter(post => post.category === 'landmark' || post.category === 'scenic')
        .map((post) => ({
          id: `spot-${post.id}`,
          images: post.images || [],
          videos: post.videos || [],
          image: post.images?.[0] || post.videos?.[0] || '',
          location: post.location,
          detailedLocation: post.detailedLocation || post.placeName || post.location,
          placeName: post.placeName,
          address: post.address,
          time: post.timeLabel || getTimeAgo(post.timestamp || post.createdAt || post.time),
          user: post.user || '여행자',
          category: post.category,
          categoryName: post.categoryName,
          aiLabels: post.aiLabels,
          tags: post.tags || post.aiLabels || [],
          note: post.note || post.content,
          likes: post.likes || post.likeCount || 0
        }));

      const foodFormatted = regionPosts
        .filter(post => post.category === 'food')
        .map((post) => ({
          id: `food-${post.id}`,
          images: post.images || [],
          videos: post.videos || [],
          image: post.images?.[0] || post.videos?.[0] || '',
          location: post.location,
          detailedLocation: post.detailedLocation || post.placeName || post.location,
          placeName: post.placeName,
          address: post.address,
          time: post.timeLabel || getTimeAgo(post.timestamp || post.createdAt || post.time),
          user: post.user || '여행자',
          category: post.category,
          categoryName: post.categoryName,
          aiLabels: post.aiLabels,
          tags: post.tags || post.aiLabels || [],
          note: post.note || post.content,
          likes: post.likes || post.likeCount || 0
        }));

      setRealtimeData(realtimeFormatted);
      setBloomingData(bloomFormatted);
      setSpotsData(spotsFormatted);
      setFoodData(foodFormatted);
    } catch (error) {
      console.error('지역 데이터 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  }, [regionName]);

  // 더 많은 아이템 로드
  const loadMoreItems = useCallback(() => {
    const baseData = getDisplayData();
    if (baseData.length === 0) {
      setDisplayedItems([]);
      return;
    }
    
    const itemsPerPage = 12;
    const startIndex = pageRef.current * itemsPerPage;
    
    if (startIndex >= baseData.length) {
      return;
    }
    
    const remainingItems = baseData.length - startIndex;
    const itemsToLoad = Math.min(itemsPerPage, remainingItems);
    
    const newItems = baseData.slice(startIndex, startIndex + itemsToLoad);
    setDisplayedItems(prev => [...prev, ...newItems]);
    pageRef.current += 1;
  }, [getDisplayData]);

  // 초기 데이터 로드
  useEffect(() => {
    loadRegionData();
  }, [loadRegionData]);

  // 탭 변경 시 스크롤 초기화
  useEffect(() => {
    pageRef.current = 0;
    setDisplayedItems([]);
    loadMoreItems();
  }, [activeTab, loadMoreItems]);

  const handleItemPress = useCallback((item, index) => {
    const allPosts = getDisplayData();
    const currentIndex = allPosts.findIndex(p => p.id === item.id);
    navigation.navigate('PostDetail', {
      postId: item.id,
      post: item,
      allPosts: allPosts,
      currentPostIndex: currentIndex >= 0 ? currentIndex : 0,
    });
  }, [navigation, getDisplayData]);

  const renderPostItem = useCallback(({ item, index }) => {
    return <PostItem item={item} index={index} onPress={handleItemPress} />;
  }, [handleItemPress]);

  return (
    <ScreenLayout>
      <ScreenContent>
        {/* 헤더 - 웹과 동일한 구조 */}
        <ScreenHeader>
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.textPrimaryLight} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{regionName}</Text>
            <View style={styles.headerPlaceholder} />
          </View>
        </ScreenHeader>

        {/* 메인 컨텐츠 - 웹과 동일한 구조 */}
        <ScreenBody>
          {/* 탭 */}
          <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && styles.tabActive
            ]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text style={[
              styles.tabText,
              activeTab === tab.id && styles.tabTextActive
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 게시물 그리드 */}
      {displayedItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="images-outline"
            size={64}
            color={COLORS.textSubtle}
          />
          <Text style={styles.emptyTitle}>
            {activeTab === 'realtime' && '현지 실시간 정보가 없어요'}
            {activeTab === 'blooming' && '개화 정보가 없어요'}
            {activeTab === 'spots' && '가볼만한 곳이 없어요'}
            {activeTab === 'food' && '맛집 정보가 없어요'}
          </Text>
          <Text style={styles.emptySubtitle}>
            첫 번째로 여행 정보를 공유하고{'\n'}다른 사용자들과 함께 만들어가요!
          </Text>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => navigation.navigate('UploadTab')}
          >
            <Text style={styles.uploadButtonText}>정보 공유하기</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={displayedItems}
          renderItem={renderPostItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.gridContainer}
          columnWrapperStyle={styles.gridRow}
          onEndReached={loadMoreItems}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isLoading ? (
              <View style={styles.loadingFooter}>
                <ActivityIndicator size="small" color={COLORS.primary} />
                <Text style={styles.loadingText}>사진 불러오는 중...</Text>
              </View>
            ) : null
          }
        />
      )}
        </ScreenBody>
      </ScreenContent>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md, // p-4
    paddingVertical: SPACING.md, // p-4
    backgroundColor: COLORS.backgroundLight, // bg-white
    borderBottomWidth: 1,
    borderBottomColor: '#E4E4E7', // border-zinc-200
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  backButton: {
    width: 48, // size-12 = 48px
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8, // rounded-lg
  },
  headerTitle: {
    fontSize: 20, // text-xl = 20px
    fontWeight: 'bold',
    color: COLORS.text, // text-text-primary-light
  },
  headerPlaceholder: {
    width: 40, // w-10 = 40px
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E4E4E7', // border-zinc-200
    backgroundColor: COLORS.backgroundLight,
    paddingHorizontal: SPACING.md,
  },
  tab: {
    flex: 1,
    paddingTop: SPACING.sm, // pt-2
    paddingBottom: 13, // pb-[13px]
    paddingHorizontal: SPACING.md, // px-3
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: COLORS.primary, // border-b-primary
  },
  tabText: {
    fontSize: 12, // text-xs
    fontWeight: 'bold',
    color: COLORS.textSecondary, // text-text-secondary-light
  },
  tabTextActive: {
    color: COLORS.primary, // text-primary
  },
  gridContainer: {
    padding: SPACING.md, // p-4 = 16px
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: 0, // gap-4는 각 아이템의 marginBottom으로 처리
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  uploadButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 999,
  },
  uploadButtonText: {
    color: COLORS.backgroundLight,
    fontSize: 16,
    fontWeight: '600',
  },
  loadingFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
    gap: SPACING.sm,
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.primary,
  },
});

// RegionCategoryScreen 전용 스타일
const categoryStyles = StyleSheet.create({
  postItem: {
    width: (SCREEN_WIDTH - SPACING.md * 3) / 2,
    marginBottom: SPACING.md, // gap-4 = 16px
  },
  postImageContainer: {
    width: '100%',
    aspectRatio: 4 / 5, // aspect-[4/5]
    borderRadius: 12, // rounded-lg
    overflow: 'hidden',
    marginBottom: 12, // mb-3 = 12px
    backgroundColor: COLORS.borderLight,
    position: 'relative',
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  postImagePlaceholder: {
    backgroundColor: COLORS.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  likeBadge: {
    position: 'absolute',
    bottom: 12, // bottom-3 = 12px
    right: 12, // right-3 = 12px
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4, // gap-1 = 4px
    backgroundColor: 'rgba(255,255,255,0.9)', // bg-white/90
    paddingHorizontal: 12, // px-3 = 12px
    paddingVertical: 6, // py-1.5 = 6px
    borderRadius: 999, // rounded-full
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, // shadow-md
    shadowRadius: 4,
    elevation: 3,
  },
  likeIcon: {
    fontSize: 16, // text-base = 16px (웹에서는 material-symbols-outlined text-base)
  },
  likeCount: {
    fontSize: 14, // text-sm = 14px
    fontWeight: '600', // font-semibold
    color: COLORS.text, // text-gray-700
  },
  postTextContainer: {
    marginTop: SPACING.sm,
    gap: SPACING.xs,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  locationText: {
    fontSize: 16, // text-base = 16px
    fontWeight: 'bold',
    color: COLORS.text, // text-text-primary-light
    flex: 1,
  },
  timeText: {
    fontSize: 12, // text-xs = 12px
    color: COLORS.textSecondary, // text-text-secondary-light
  },
  subLocationText: {
    fontSize: 14, // text-sm = 14px
    color: COLORS.textSecondary, // text-text-secondary-light
    marginTop: 2, // mt-0.5 = 2px
  },
  tagsScroll: {
    marginVertical: SPACING.xs,
  },
  tagsScrollContent: {
    gap: SPACING.xs,
  },
  tagBadge: {
    backgroundColor: COLORS.primary + '1A', // bg-primary/10
    paddingHorizontal: 10, // px-2.5 = 10px
    paddingVertical: 4, // py-1 = 4px
    borderRadius: 999, // rounded-full
    marginRight: 6, // gap-1.5 = 6px
  },
  tagText: {
    fontSize: 12, // text-xs = 12px
    fontWeight: '500', // font-medium
    color: COLORS.primary, // text-primary
  },
  noteText: {
    fontSize: 14, // text-sm = 14px
    color: COLORS.textSecondary, // text-text-secondary-light
    lineHeight: 20, // line-clamp-2 (대략 2줄)
  },
});

export default RegionCategoryScreen;



