export interface productModel {
    id: number,
    expireDate?: string,
    barCodeID: string,
    name: string,
    description: string,
    region: string,
    imageUrl?: string,
    brand: string,
    category: string,
    createdDate?: Date
}

// operation succcess  [
    // {
    //   id: 2,
    //   authorId: 4,
    //   expireDate: '2024-04-30',
    //   barCodeID: '1234567890',
    //   name: 'Dummy Product',
    //   description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    //   region: 'North America',
    //   imageUrl: 'https://example.com/image.jpg',
    //   brand: 'Dummy Brand',
    //   category: 'Electronics',
    //   createdDate: 2024-04-23T10:16:18.188Z
    // }
//   ]
//   