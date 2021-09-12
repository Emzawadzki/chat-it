export namespace RequestParameters {
  export interface Authorized {
    username?: string;
  }
}

// Note: all fields in namespace should be optional, to enforce check before use
export namespace RequestBody {
  export interface UserCredentials {
    password?: string;
    username?: string;
  }
}

export namespace ResponseBody {
  export interface UserToken {
    token: string;
  }
  export interface UserData {
    username: string;
    id: number;
  }
}
