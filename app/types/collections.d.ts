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

interface ModsCollection {
  id: number;
  mod_id: number;
  collection: Collection;
}

interface ModsCollectionResponse {
  resource: ModsCollection;
  info: InfoDetail;
}
