export interface Story {
  kids: any;
  id: number;
  title: string;
  url: string;
  by: string;
  score: number;
  time: number;
  descendants: number;
}

export interface Comment {
  id: number;
  by: string;
  time: number;
  text: string;
  kids?: number[];
  parent: number;
}

type RootStackParamList = {
  Home: undefined;
  Details: { item: Story };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList { }
  }
}