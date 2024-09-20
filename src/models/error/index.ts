export interface ErrorResponseAxios {
  response: {
    data: {
      message: string;
    };
    status: number;
  };
}
