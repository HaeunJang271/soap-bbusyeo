interface Window {
  Kakao?: {
    init: (appKey: string) => void;
    Link: {
      sendDefault: (options: any) => void;
    };
  };
}
