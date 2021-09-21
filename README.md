# dynamo-single-table-application

An eCommerce application using a single DynamoDb table

## Environment setup

```bash
yarn local:up

# tear down localstack docker container
yarn local:down
```

## Testing

```bash
yarn test
```

## Table design

### Access patterns

todo

### Customers

sample record

```
{
    "pk": {
        "S": "c#0d7c881e-2f3a-4cac-b88d-b85c6e3730f1"
    },
    "sk": {
        "S": "c#0d7c881e-2f3a-4cac-b88d-b85c6e3730f1"
    },
    "name": {
        "S": "Lorine53"
    },
    "email": {
        "S": "Lincoln.Moen17@gmail.com"
    },
    "entityType": {
        "S": "customer"
    }
}
```

### Products

sample record

```
{
    "pk": {
        "S": "p#bc57f47a-4df6-4a89-9e4e-308b38f31310"
    },
    "sk": {
        "S": "p#bc57f47a-4df6-4a89-9e4e-308b38f31310"
    },
    "name": {
        "S": "vacuum cleaner"
    },
    "price": {
        "N": "908.55"
    },
    "entityType": {
        "S": "product"
    }
},
```

### Warehouse

sample record

```
{
    "pk": {
        "S": "w#64313598-189d-4974-822c-5a055d6ee0cf"
    },
    "sk": {
        "S": "w#64313598-189d-4974-822c-5a055d6ee0cf"
    },
    "address": {
        "M": {
            "postcode": {
                "S": "25087"
            },
            "town": {
                "S": "Buckinghamshire"
            },
            "city": {
                "S": "East Melany"
            },
            "line1": {
                "S": "13192 Jacobi Grove"
            }
        }
    },
    "entityType": {
        "S": "warehouse"
    }
},
```

### Orders

sample record

```
{
    "pk": {
        "S": "o#eecf9a88-0ef5-477a-8dcd-5a09c565b480"
    },
    "sk": {
        "S": "c#0b96a2f4-9df0-491f-9041-f920e46ac960"
    },
    "date": {
        "S": "2021-09-21T22:44:29.326Z"
    },
    "entityType": {
        "S": "order"
    }
}
```

## References

This work is largely taken from and inspired by the following sources:

- [Single-Table Design with DynamoDB - Alex DeBrie, AWS Data Hero](https://youtu.be/BnDKD_Zv0og?t=0)
- [Fundamentals of Amazon DynamoDB Single Table Design with Rick Houlihan](https://www.youtube.com/watch?v=KYy8X8t4MB8&t=0)
- [amazon-dynamodb-design-patterns](https://github.com/aws-samples/amazon-dynamodb-design-patterns)
