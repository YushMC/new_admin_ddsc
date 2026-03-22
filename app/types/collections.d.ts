interface Collection {
  id: number;
  name: string;
  description: string;
  is_seasonal: boolean;
  start_date: string | null;
  end_date: string | null;
}

interface CollectionResponse {
  resource: Collection;
  info: InfoDetail;
}
