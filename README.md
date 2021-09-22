# dynamo-single-table-application

An eCommerce application using a single [DynamoDb](https://aws.amazon.com/dynamodb/) table

![DynamoDb](./design/DynamoDB.png)

## References

This work is largely taken from and inspired by the following sources:

- [Fundamentals of Amazon DynamoDB Single Table Design with Rick Houlihan](https://www.youtube.com/watch?v=KYy8X8t4MB8&t=0)
- [amazon-dynamodb-design-patterns](https://github.com/aws-samples/amazon-dynamodb-design-patterns)
- [Single-Table Design with DynamoDB - Alex DeBrie, AWS Data Hero](https://youtu.be/BnDKD_Zv0og?t=0)

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

truncate the dynamo table

```bash
yarn purge
```

## AWS commands

```bash
awslocal dynamodb scan --table-name table
awslocal dynamodb scan --table-name table --index-name gsi1
```

## Table design

### Access patterns

1. get customer by customer id
2. get product by product id
3. get warehouse by warehouse id
4. get order by order id
5. get invoice by invoice id (GSI1)
6. get product inventory by product id for all warehouses
7. get shipments by order id
8. get invoice by order id
9. get products by order id

### Key prefixes

- `c#` = customer
- `p#` = product
- `w#` = warehouse
- `o#` = order
- `i#` = invoice
- `s#` = shipment
- `d#` = shipment item (delivery)

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

sample warehouse record

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
            "line1": {
                "S": "13192 Jacobi Grove"
            },
            "town": {
                "S": "Buckinghamshire"
            },
            "city": {
                "S": "East Melany"
            },
            "postcode": {
                "S": "25087"
            }
        }
    },
    "entityType": {
        "S": "warehouse"
    }
},
```

sample stock inventory record

```
{
    "pk": {
        "S": "p#da5f95b9-ae14-49c5-829e-cbb1e4edeea9"
    },
    "sk": {
        "S": "w#781e14ba-9dda-4a4b-96c2-91bf0240d4fb"
    },
    "quantity": {
        "N": "51"
    },
    "entityType": {
        "S": "warehouseStock"
    }
},
```

### Orders

sample order record

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

sample order invoice record

```
{
    "pk": {
        "S": "o#c660de9e-78db-49e8-bc48-da2f5672077c"
    },
    "sk": {
        "S": "i#6fb083f1-0468-482a-9cdb-ea101b9e49a0"
    },
    "gsi1_pk": {
        "S": "i#6fb083f1-0468-482a-9cdb-ea101b9e49a0"
    },
    "gsi1_sk": {
        "S": "i#6fb083f1-0468-482a-9cdb-ea101b9e49a0"
    },
    "date": {
        "S": "2021-09-21T23:27:09.104Z"
    },
    "amount": {
        "N": "313.06"
    },
    "entityType": {
        "S": "invoice"
    },
    "payments": {
        "L": [
            {
                "M": {
                    "type": {
                        "S": "amex"
                    },
                    "amount": {
                        "N": "313.06"
                    }
                }
            }
        ]
    }
},
```

order item sample record

```
{
    "pk": {
        "S": "o#0cface48-4d49-472f-9576-62ac39eb67f9"
    },
    "sk": {
        "S": "p#4e86ea63-f312-4da0-981f-50996c946644"
    },
    "quantity": {
        "N": "2"
    },
    "price": {
        "N": "421.51"
    },
    "entityType": {
        "S": "orderItem"
    }
}
```

order shipment sample record

```
{
    "pk": {
        "S": "o#26c013ed-d9fd-4e1d-b83f-ac6894e7abaa"
    },
    "sk": {
        "S": "s#a13ad3f1-fef6-4175-b427-0b93bb9deaad"
    },
    "date": {
        "S": "2021-09-22T06:57:20.497Z"
    },
    "address": {
        "M": {
            "line1": {
                "S": "79477 Runte Ports"
            },
            "town": {
                "S": "Avon"
            },
            "city": {
                "S": "Romagueraview"
            },
            "postcode": {
                "S": "52996-8189"
            }
        }
    },
    "type": {
        "S": "express"
    },
    "entityType": {
        "S": "shipment"
    }
},
```

order shipment item sample record

```
 {
    "pk": {
        "S": "o#8d15df01-8b88-4c06-9a05-8076afdbd390"
    },
    "sk": {
        "S": "d#5834894c-e528-4c7f-b989-9e28c08e6e71"
    },
    "productId": {
        "S": "13d8acb6-a811-4b3c-b243-359b4f0245e0"
    },
    "shipmentId": {
        "S": "4c3af2cc-a376-4e5e-a048-fd3e10a58ae5"
    },
    "quantity": {
        "N": "3"
    },
    "entityType": {
        "S": "shipmentItem"
    }
},
```
