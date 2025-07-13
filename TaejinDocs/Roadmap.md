# React Native + TypeScript 카페인 앱 개발 학습 로드맵 ☕

## 🎯 시작하기 전에: 핵심 개념 이해

React Native는 React의 철학을 모바일로 확장한 것입니다. 웹의 `<div>`가 `<View>`로, `<span>`이 `<Text>`로 바뀌었다고 생각하면 됩니다. 하지만 이는 단순한 태그 교체가 아니라, 네이티브 플랫폼의 실제 UI 컴포넌트로 변환되는 과정입니다.

## 📚 Phase 1: React Native 기초 & TypeScript 설정 (1주차)

### Day 1-2: 개발 환경 구축과 첫 실행

**학습 목표**: Expo와 React Native CLI의 차이를 이해하고, TypeScript 환경을 완벽히 구성합니다.

공식 문서의 [Environment Setup](https://reactnative.dev/docs/environment-setup)을 따라 진행하되, 여러분은 이미 Expo로 시작했으니 Expo의 장단점을 먼저 이해해봅시다:

- **Expo의 장점**: 빠른 시작, 많은 기능이 내장됨
- **Expo의 한계**: 네이티브 모듈 커스터마이징 제한
- **우리의 선택**: 카페인 앱은 Expo로 충분하지만, 나중에 `expo prebuild`로 eject 가능

**실습: TypeScript 설정 완성하기**
```typescript
// app.json 수정
{
  "expo": {
    "name": "카페인 중독",
    "slug": "caffeine-addiction",
    "scheme": "caffeineapp" // 딥링킹을 위한 스킴
  }
}

// tsconfig.json 최적화
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@screens/*": ["./src/screens/*"],
      "@utils/*": ["./src/utils/*"]
    }
  }
}
```

### Day 3-4: Core Components 깊이 이해하기

**학습 내용**: [Core Components](https://reactnative.dev/docs/components-and-apis)의 진짜 의미

React Native의 컴포넌트는 단순한 HTML 대체물이 아닙니다. 각각이 iOS의 UIView나 Android의 View로 변환되는 브릿지 역할을 합니다.

```typescript
// src/components/CaffeineButton.tsx
import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle
} from 'react-native';

interface CaffeineButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary';
}

// TouchableOpacity의 각 속성이 왜 중요한지 이해해봅시다
export const CaffeineButton: React.FC<CaffeineButtonProps> = ({
  title,
  variant = 'primary',
  style,
  ...props
}) => {
  return (
    <TouchableOpacity
      // activeOpacity는 누름 효과의 투명도를 제어합니다
      activeOpacity={0.8}
      // style prop을 배열로 전달하면 스타일이 합쳐집니다
      style={[
        styles.button,
        variant === 'primary' ? styles.primary : styles.secondary,
        style
      ]}
      {...props}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

// StyleSheet.create()는 왜 사용할까요?
// 1. 스타일 객체를 한 번만 생성 (성능)
// 2. 개발 중 타입 체크
// 3. 스타일 객체 불변성 보장
const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  } as ViewStyle,
  primary: {
    backgroundColor: '#8B4513',
  } as ViewStyle,
  secondary: {
    backgroundColor: '#FF8C00',
  } as ViewStyle,
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  } as TextStyle,
});
```

### Day 5-6: Flexbox 마스터하기

**학습 내용**: [Flexbox](https://reactnative.dev/docs/flexbox)는 React Native의 핵심입니다.

웹과 다른 점:
- `flexDirection`의 기본값이 `column` (웹은 `row`)
- `flex: 1`의 의미가 조금 다름
- `alignItems`의 기본값이 `stretch`

```typescript
// src/screens/HomeScreen.tsx
// 카페인 앱 홈 화면의 레이아웃 구조 만들기
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const HomeScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* 상단 영역: flex 없음 = 콘텐츠 크기만큼 차지 */}
      <View style={styles.header}>
        <Text style={styles.greeting}>안녕하세요! ☕</Text>
      </View>
      
      {/* 중앙 영역: flex: 1 = 남은 공간 모두 차지 */}
      <View style={styles.content}>
        <View style={styles.caffeineCircle}>
          <Text style={styles.caffeineText}>180mg</Text>
        </View>
      </View>
      
      {/* 하단 영역: 고정 높이 */}
      <View style={styles.footer}>
        <CaffeineButton title="카페인 섭취" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // 전체 화면을 차지
    backgroundColor: '#FFFFFF',
  },
  header: {
    // flex 없음: 자식 요소 크기만큼만
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  content: {
    flex: 1, // 헤더와 푸터 사이의 모든 공간
    justifyContent: 'center', // 세로 중앙 정렬
    alignItems: 'center', // 가로 중앙 정렬
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  // ... 기타 스타일
});
```

### Day 7: Platform-specific 코드 작성하기

**학습 내용**: [Platform-specific code](https://reactnative.dev/docs/platform-specific-code)

iOS와 Android는 다른 디자인 언어를 사용합니다. React Native는 이를 우아하게 처리할 방법을 제공합니다.

```typescript
// src/utils/platform.ts
import { Platform, Dimensions } from 'react-native';

// 플랫폼별 상수 정의
export const PLATFORM = {
  IS_IOS: Platform.OS === 'ios',
  IS_ANDROID: Platform.OS === 'android',
  // iOS는 노치가 있는 기기 고려
  SAFE_AREA_TOP: Platform.select({
    ios: 44,
    android: 24,
    default: 20,
  }),
};

// 반응형 디자인을 위한 도우미
const { width, height } = Dimensions.get('window');
export const SCREEN = {
  WIDTH: width,
  HEIGHT: height,
  // 작은 화면 감지 (iPhone SE 등)
  IS_SMALL: width < 375,
};

// 플랫폼별 스타일 헬퍼
export const shadow = (elevation: number = 4) => {
  return Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: elevation / 2 },
      shadowOpacity: 0.1,
      shadowRadius: elevation,
    },
    android: {
      elevation,
    },
  });
};
```

---

## 🎨 Phase 2: 상태 관리와 데이터 흐름 (2주차)

### Day 8-9: React Hooks in React Native

**학습 내용**: [State and Lifecycle](https://reactnative.dev/docs/state)를 TypeScript와 함께

React Native에서 상태 관리는 웹과 동일하지만, 모바일 특유의 고려사항이 있습니다:

```typescript
// src/hooks/useCaffeineCalculator.ts
import { useState, useEffect, useCallback } from 'react';

// 카페인 반감기는 약 5시간
const CAFFEINE_HALF_LIFE = 5 * 60 * 60 * 1000; // milliseconds

interface CaffeineRecord {
  id: string;
  amount: number;
  timestamp: Date;
  source: string;
}

export const useCaffeineCalculator = () => {
  const [records, setRecords] = useState<CaffeineRecord[]>([]);
  const [currentCaffeine, setCurrentCaffeine] = useState(0);

  // 현재 체내 카페인 계산
  const calculateCurrentCaffeine = useCallback(() => {
    const now = Date.now();
    
    const totalCaffeine = records.reduce((total, record) => {
      const timePassed = now - record.timestamp.getTime();
      const halfLives = timePassed / CAFFEINE_HALF_LIFE;
      // 지수 감소: amount * (0.5)^halfLives
      const remainingCaffeine = record.amount * Math.pow(0.5, halfLives);
      return total + remainingCaffeine;
    }, 0);

    setCurrentCaffeine(Math.round(totalCaffeine));
  }, [records]);

  // 1분마다 재계산 (배터리 효율성 고려)
  useEffect(() => {
    calculateCurrentCaffeine();
    const interval = setInterval(calculateCurrentCaffeine, 60000);
    
    return () => clearInterval(interval);
  }, [calculateCurrentCaffeine]);

  return {
    currentCaffeine,
    addCaffeineRecord: (amount: number, source: string) => {
      const newRecord: CaffeineRecord = {
        id: Date.now().toString(),
        amount,
        timestamp: new Date(),
        source,
      };
      setRecords(prev => [...prev, newRecord]);
    },
    records,
  };
};
```

### Day 10-11: AsyncStorage와 데이터 영속성

**학습 내용**: [AsyncStorage](https://reactnative.dev/docs/asyncstorage) - 앱의 localStorage

모바일 앱은 언제든 종료될 수 있습니다. 데이터를 안전하게 저장하는 것이 중요합니다:

```typescript
// src/services/storage.service.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

// Type-safe 스토리지 키
enum StorageKeys {
  CAFFEINE_RECORDS = '@caffeine_records',
  USER_SETTINGS = '@user_settings',
  QUICK_MENU = '@quick_menu',
}

// Generic 타입을 사용한 type-safe storage
class StorageService {
  // 저장할 때 자동으로 JSON 직렬화
  async set<T>(key: StorageKeys, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
      throw error;
    }
  }

  // 가져올 때 타입 보장
  async get<T>(key: StorageKeys, defaultValue: T): Promise<T> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : defaultValue;
    } catch (error) {
      console.error(`Error loading ${key}:`, error);
      return defaultValue;
    }
  }

  // 마이그레이션을 위한 버전 관리
  async migrate(): Promise<void> {
    const version = await this.get(StorageKeys.VERSION, 0);
    
    if (version < 1) {
      // v0 → v1 마이그레이션 로직
      console.log('Migrating to v1...');
    }
  }
}

export const storage = new StorageService();
```

### Day 12-13: React Navigation과 화면 전환

**학습 내용**: [React Navigation](https://reactnavigation.org/) - 공식 권장 네비게이션

```typescript
// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// TypeScript를 위한 타입 정의
export type RootStackParamList = {
  Main: undefined;
  CaffeineModal: { category: string };
  Settings: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Stats: undefined;
  Detox: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// 탭 네비게이터
const MainTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => <Coffee color={color} />,
        }}
      />
      <Tab.Screen name="Stats" component={StatsScreen} />
      <Tab.Screen name="Detox" component={DetoxScreen} />
    </Tab.Navigator>
  );
};

// 루트 네비게이터 (모달 포함)
export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Main" 
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="CaffeineModal"
          component={CaffeineModal}
          options={{ 
            presentation: 'modal',
            headerTitle: '카페인 추가',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
```

### Day 14: Context API와 전역 상태 관리

**학습 내용**: 앱 전체에서 공유되는 상태 관리

```typescript
// src/contexts/CaffeineContext.tsx
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// 상태 타입 정의
interface CaffeineState {
  records: CaffeineRecord[];
  userSettings: UserSettings;
  isLoading: boolean;
}

// 액션 타입 정의
type CaffeineAction =
  | { type: 'ADD_RECORD'; payload: CaffeineRecord }
  | { type: 'DELETE_RECORD'; payload: string }
  | { type: 'SET_RECORDS'; payload: CaffeineRecord[] }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<UserSettings> };

// Reducer 함수
const caffeineReducer = (
  state: CaffeineState,
  action: CaffeineAction
): CaffeineState => {
  switch (action.type) {
    case 'ADD_RECORD':
      return {
        ...state,
        records: [...state.records, action.payload],
      };
    // ... 다른 케이스들
    default:
      return state;
  }
};

// Context 생성
const CaffeineContext = createContext<{
  state: CaffeineState;
  dispatch: React.Dispatch<CaffeineAction>;
} | null>(null);

// Provider 컴포넌트
export const CaffeineProvider: React.FC<{ children: ReactNode }> = ({ 
  children 
}) => {
  const [state, dispatch] = useReducer(caffeineReducer, initialState);

  // 앱 시작 시 데이터 로드
  useEffect(() => {
    loadStoredData();
  }, []);

  return (
    <CaffeineContext.Provider value={{ state, dispatch }}>
      {children}
    </CaffeineContext.Provider>
  );
};

// 커스텀 훅으로 사용 편의성 증대
export const useCaffeine = () => {
  const context = useContext(CaffeineContext);
  if (!context) {
    throw new Error('useCaffeine must be used within CaffeineProvider');
  }
  return context;
};
```

---

## 🚀 Phase 3: 애니메이션과 인터랙션 (3주차)

### Day 15-16: Animated API 기초

**학습 내용**: [Animations](https://reactnative.dev/docs/animations)으로 생동감 있는 UI 만들기

```typescript
// src/components/CaffeineProgressRing.tsx
import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Animated, 
  StyleSheet,
  Text,
  Dimensions
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProgressRingProps {
  current: number;
  max: number;
  status: 'safe' | 'warning' | 'danger';
}

export const CaffeineProgressRing: React.FC<ProgressRingProps> = ({
  current,
  max,
  status,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const { width } = Dimensions.get('window');
  const size = width * 0.7;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  useEffect(() => {
    // 부드러운 애니메이션으로 진행률 표시
    Animated.timing(animatedValue, {
      toValue: current / max,
      duration: 1000,
      useNativeDriver: true, // 성능 최적화
    }).start();
  }, [current, max]);

  // 애니메이션 값을 stroke-dashoffset으로 변환
  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  const statusColors = {
    safe: '#4CAF50',
    warning: '#FF9800',
    danger: '#F44336',
  };

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {/* 배경 원 */}
        <Circle
          stroke="#E0E0E0"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        {/* 진행률 원 */}
        <AnimatedCircle
          stroke={statusColors[status]}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90, ${size / 2}, ${size / 2})`}
        />
      </Svg>
      <View style={styles.textContainer}>
        <Text style={styles.mainText}>{current}mg</Text>
        <Text style={styles.subText}>
          아메리카노 {((max - current) / 150).toFixed(1)}잔 더 가능
        </Text>
      </View>
    </View>
  );
};
```

### Day 17-18: Gesture Handler와 인터랙션

**학습 내용**: [Gesture Responder System](https://reactnative.dev/docs/gesture-responder-system)

```typescript
// src/components/SwipeableRecord.tsx
import React from 'react';
import { 
  PanGestureHandler,
  PanGestureHandlerGestureEvent 
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

interface SwipeableRecordProps {
  record: CaffeineRecord;
  onDelete: () => void;
}

export const SwipeableRecord: React.FC<SwipeableRecordProps> = ({
  record,
  onDelete,
}) => {
  const translateX = useSharedValue(0);
  const itemHeight = useSharedValue(70);
  const opacity = useSharedValue(1);

  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { startX: number }
  >({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
    },
    onActive: (event, ctx) => {
      translateX.value = ctx.startX + event.translationX;
    },
    onEnd: () => {
      const shouldDelete = translateX.value < -100;
      
      if (shouldDelete) {
        translateX.value = withSpring(-400);
        itemHeight.value = withSpring(0);
        opacity.value = withSpring(0, {}, (finished) => {
          if (finished) {
            runOnJS(onDelete)();
          }
        });
      } else {
        translateX.value = withSpring(0);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    height: itemHeight.value,
    opacity: opacity.value,
  }));

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.container, animatedStyle]}>
        {/* 카페인 기록 내용 */}
      </Animated.View>
    </PanGestureHandler>
  );
};
```

### Day 19-20: 성능 최적화

**학습 내용**: [Performance](https://reactnative.dev/docs/performance) 최적화 기법

```typescript
// src/screens/StatsScreen.tsx
import React, { useMemo, useCallback } from 'react';
import { FlatList, View, Text } from 'react-native';

// React.memo로 불필요한 리렌더링 방지
const StatItem = React.memo<{ stat: DailyStat }>(({ stat }) => {
  return (
    <View style={styles.statItem}>
      <Text>{stat.date}</Text>
      <Text>{stat.totalCaffeine}mg</Text>
    </View>
  );
});

export const StatsScreen: React.FC = () => {
  const { records } = useCaffeine();

  // 비용이 큰 계산은 useMemo로 캐싱
  const dailyStats = useMemo(() => {
    return calculateDailyStats(records);
  }, [records]);

  // 콜백 함수도 useCallback으로 최적화
  const renderItem = useCallback(({ item }: { item: DailyStat }) => {
    return <StatItem stat={item} />;
  }, []);

  const keyExtractor = useCallback((item: DailyStat) => item.date, []);

  return (
    <FlatList
      data={dailyStats}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      // 성능 최적화 옵션들
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={10}
      removeClippedSubviews={true}
      // 리스트 최적화
      getItemLayout={(data, index) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index,
      })}
    />
  );
};
```

---

## 📱 Phase 4: 네이티브 기능과 고급 패턴 (4주차)

### Day 21-22: Push Notifications

**학습 내용**: [Push Notifications](https://docs.expo.dev/push-notifications/overview/)

```typescript
// src/services/notification.service.ts
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// 알림 설정
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export class NotificationService {
  // 권한 요청
  async requestPermissions(): Promise<boolean> {
    const { status: existingStatus } = 
      await Notifications.getPermissionsAsync();
    
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    return finalStatus === 'granted';
  }

  // 로컬 알림 예약
  async scheduleOverdoseWarning(currentCaffeine: number): Promise<void> {
    if (currentCaffeine > 300) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '카페인 과다 섭취 주의! ⚠️',
          body: `현재 체내 카페인: ${currentCaffeine}mg`,
          data: { type: 'overdose', amount: currentCaffeine },
        },
        trigger: null, // 즉시 발송
      });
    }
  }

  // 디로딩 리마인더
  async scheduleDetoxReminder(time: Date): Promise<string> {
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: '디로딩 시간입니다 🌿',
        body: '오늘의 카페인 섭취를 줄여보세요',
        data: { type: 'detox' },
      },
      trigger: {
        hour: time.getHours(),
        minute: time.getMinutes(),
        repeats: true,
      },
    });
    
    return identifier;
  }
}

export const notificationService = new NotificationService();
```

### Day 23-24: 백그라운드 작업과 App State

**학습 내용**: [AppState](https://reactnative.dev/docs/appstate)와 백그라운드 처리

```typescript
// src/hooks/useAppState.ts
import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export const useAppState = (
  onChange: (status: AppStateStatus) => void
) => {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      // 백그라운드에서 포그라운드로 전환
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('앱이 다시 활성화되었습니다');
        // 카페인 수치 재계산
        onChange('active');
      }

      // 포그라운드에서 백그라운드로 전환
      if (
        appState.current === 'active' &&
        nextAppState.match(/inactive|background/)
      ) {
        console.log('앱이 백그라운드로 전환되었습니다');
        // 현재 상태 저장
        onChange(nextAppState);
      }

      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, [onChange]);

  return appState.current;
};
```

### Day 25-26: 테스팅 전략

**학습 내용**: [Testing](https://reactnative.dev/docs/testing-overview)

```typescript
// __tests__/CaffeineCalculator.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import { useCaffeineCalculator } from '../src/hooks/useCaffeineCalculator';

describe('CaffeineCalculator', () => {
  it('should calculate caffeine decay correctly', () => {
    const { result } = renderHook(() => useCaffeineCalculator());

    // 초기 상태 확인
    expect(result.current.currentCaffeine).toBe(0);

    // 카페인 추가
    act(() => {
      result.current.addCaffeineRecord(150, '아메리카노');
    });

    expect(result.current.currentCaffeine).toBe(150);

    // 시간 경과 시뮬레이션 (5시간 후)
    jest.advanceTimersByTime(5 * 60 * 60 * 1000);

    // 반감기 후 75mg 예상
    expect(result.current.currentCaffeine).toBeCloseTo(75, 0);
  });
});

// src/components/__tests__/CaffeineButton.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CaffeineButton } from '../CaffeineButton';

describe('CaffeineButton', () => {
  it('should call onPress when tapped', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <CaffeineButton title="테스트" onPress={mockOnPress} />
    );

    fireEvent.press(getByText('테스트'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });
});
```

### Day 27-28: 디버깅과 개발 도구

**학습 내용**: [Debugging](https://reactnative.dev/docs/debugging) 마스터하기

```typescript
// src/utils/debug.ts
import { LogBox } from 'react-native';

// 개발 환경 설정
if (__DEV__) {
  // 특정 경고 무시
  LogBox.ignoreLogs([
    'VirtualizedLists should never be nested',
  ]);

  // 커스텀 로거
  global.log = (message: string, data?: any) => {
    console.log(`🔍 [${new Date().toISOString()}] ${message}`, data);
  };

  // React Native Debugger 연결 확인
  if (typeof atob === 'undefined') {
    global.atob = require('base-64').decode;
  }
} else {
  // 프로덕션에서는 console 비활성화
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
}

// Flipper 플러그인 설정
export const setupFlipper = () => {
  if (__DEV__) {
    require('react-native-flipper').default();
  }
};
```

---

## 🚢 Phase 5: 배포 준비 (5주차)

### Day 29-30: 빌드 최적화

**학습 내용**: [Publishing](https://reactnative.dev/docs/publishing-to-app-store)

```typescript
// metro.config.js - 번들 최적화
module.exports = {
  transformer: {
    minifierConfig: {
      keep_fns: true,
      mangle: {
        keep_classnames: true,
        keep_fnames: true,
      },
    },
  },
};

// babel.config.js - 프로덕션 최적화
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // 프로덕션에서 console 제거
      process.env.NODE_ENV === 'production' && 
        ['transform-remove-console', { exclude: ['error', 'warn'] }],
    ].filter(Boolean),
  };
};
```

### Day 31-32: 앱 스토어 준비

**학습 내용**: 배포를 위한 체크리스트

```json
// app.json - 스토어 설정
{
  "expo": {
    "name": "카페인 중독",
    "slug": "caffeine-addiction",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#8B4513"
    },
    "ios": {
      "supportsTablet": false,
      "bundleIdentifier": "com.yourname.caffeineaddiction",
      "buildNumber": "1",
      "infoPlist": {
        "NSCameraUsageDescription": "카페인 제품 바코드 스캔용"
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#8B4513"
      },
      "package": "com.yourname.caffeineaddiction",
      "versionCode": 1,
      "permissions": ["VIBRATE", "RECEIVE_BOOT_COMPLETED"]
    }
  }
}
```

### Day 33-35: 모니터링과 분석

**학습 내용**: 프로덕션 앱 모니터링

```typescript
// src/services/analytics.service.ts
import * as Analytics from 'expo-firebase-analytics';
import { Platform } from 'react-native';

export class AnalyticsService {
  // 이벤트 추적
  async trackCaffeineIntake(amount: number, source: string): Promise<void> {
    await Analytics.logEvent('caffeine_intake', {
      amount,
      source,
      platform: Platform.OS,
      timestamp: new Date().toISOString(),
    });
  }

  // 화면 추적
  async trackScreen(screenName: string): Promise<void> {
    await Analytics.logEvent('screen_view', {
      screen_name: screenName,
      screen_class: screenName,
    });
  }

  // 사용자 속성 설정
  async setUserProperties(properties: {
    caffeineGoal?: number;
    sensitivity?: 'low' | 'medium' | 'high';
  }): Promise<void> {
    if (properties.caffeineGoal) {
      await Analytics.setUserProperty(
        'caffeine_goal',
        properties.caffeineGoal.toString()
      );
    }
  }
}

// src/services/crashlytics.service.ts
import crashlytics from '@react-native-firebase/crashlytics';

export const setupCrashlytics = () => {
  // 에러 경계 설정
  ErrorUtils.setGlobalHandler((error, isFatal) => {
    crashlytics().recordError(error);
    
    if (isFatal) {
      crashlytics().log('Fatal error occurred');
      // 사용자에게 앱 재시작 알림
    }
  });
};
```

---

## 📚 추가 학습 리소스

### 필수 문서
1. [React Native 공식 문서](https://reactnative.dev/docs/getting-started)
2. [TypeScript 핸드북](https://www.typescriptlang.org/docs/)
3. [React Navigation 문서](https://reactnavigation.org/)
4. [Expo 문서](https://docs.expo.dev/)

### 추천 패턴과 베스트 프랙티스
1. **컴포넌트 구조**: Presentational vs Container 컴포넌트
2. **상태 관리**: Local State → Context → Redux (필요시)
3. **스타일링**: StyleSheet → Themed Components
4. **테스팅**: Unit → Integration → E2E
5. **성능**: Measure → Optimize → Monitor

### 커뮤니티 리소스
- React Native Community GitHub
- r/reactnative 서브레딧
- React Native Seoul 밋업
- Infinite Red의 React Native Newsletter

---

## 🎓 마무리 조언

React Native 개발은 웹 개발과 비슷하면서도 다릅니다. 가장 중요한 차이점들:

1. **성능이 중요합니다**: 모바일 기기는 제한된 리소스를 가집니다
2. **플랫폼별 차이를 존중하세요**: iOS와 Android 사용자의 기대가 다릅니다
3. **네이티브를 이해하세요**: 브릿지의 한계를 알면 더 나은 앱을 만들 수 있습니다
4. **사용자 경험 우선**: 부드러운 애니메이션과 즉각적인 피드백이 핵심입니다

이제 시작할 준비가 되셨나요? 첫 주부터 차근차근 진행하시고, 막히는 부분이 있으면 언제든 질문해주세요! 🚀
