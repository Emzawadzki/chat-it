export namespace RequestParameters {
  export interface Authorized {
    user?: UserData;
  }
}

// Note: all fields in namespace should be optional, to enforce check before use
export namespace RequestBody {
  export interface UserCredentials {
    password?: string;
    username?: string;
  }

  export interface NewConversation {
    attendeeIds?: number[];
  }
}

export namespace ResponseBody {
  export interface UserToken {
    token: string;
  }
  export interface User {
    user: UserData | null;
  }
  export interface AllUsers {
    users: UserData[];
  }
  export interface NewConversation {
    conversationId: number;
  }
}
