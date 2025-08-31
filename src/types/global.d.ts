interface Window {
  Kakao?: {
    init: (appKey: string) => void;
    Link: {
      sendDefault: (options: any) => void;
    };
  };
}

// Kakao SDK types
declare global {
  interface Window {
    Kakao: any;
  }
}

declare module 'kakao-js-sdk' {
  export interface KakaoUser {
    id: number;
    connected_at: string;
    properties: {
      nickname: string;
      profile_image?: string;
      thumbnail_image?: string;
    };
    kakao_account: {
      profile_needs_agreement?: boolean;
      profile?: {
        nickname: string;
        thumbnail_image_url?: string;
        profile_image_url?: string;
        is_default_image?: boolean;
      };
      email_needs_agreement?: boolean;
      email?: string;
      age_range_needs_agreement?: boolean;
      age_range?: string;
      birthday_needs_agreement?: boolean;
      birthday?: string;
      gender_needs_agreement?: boolean;
      gender?: string;
      phone_number_needs_agreement?: boolean;
      phone_number?: string;
      ci_needs_agreement?: boolean;
      ci?: string;
      ci_authenticated_at?: string;
    };
  }

  export interface KakaoAuthResponse {
    access_token: string;
    token_type: string;
    refresh_token: string;
    expires_in: number;
    scope: string;
    refresh_token_expires_in: number;
  }
}
