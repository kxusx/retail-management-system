const { Sequelize, DataTypes } = require('sequelize');

const initModels = (sequelize) => {
  // Customer Model
  const Customer = sequelize.define('Customer', {
    customer_id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
      allowNull: false
    },
    zip_code: {
      type: DataTypes.STRING(10),
      allowNull: true
    }
  }, {
    tableName: 'Customer',
    timestamps: false
  });

  // Geolocation Model
  const Geolocation = sequelize.define('Geolocation', {
    zip_code: {
      type: DataTypes.STRING(10),
      primaryKey: true,
      allowNull: false
    },
    geolocation_city: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    geolocation_lat: {
      type: DataTypes.DECIMAL(10, 6),
      allowNull: true
    },
    geolocation_lng: {
      type: DataTypes.DECIMAL(10, 6),
      allowNull: true
    },
    geolocation_state: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    tableName: 'Geolocation',
    timestamps: false
  });

  // Order Model
  const Order = sequelize.define('Order', {
    order_id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
      allowNull: false
    },
    customer_id: {
      type: DataTypes.STRING(36),
      allowNull: true
    },
    order_purchase_timestamp: {
      type: DataTypes.DATE,
      allowNull: true
    },
    approved_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    delivered_carrier_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    delivered_customer_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    estimated_delivery_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: true
    }
  }, {
    tableName: 'Order',
    timestamps: false
  });

  // OrderItem Model
  const OrderItem = sequelize.define('OrderItem', {
    order_item_id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
      allowNull: false
    },
    order_id: {
      type: DataTypes.STRING(36),
      allowNull: true
    },
    product_id: {
      type: DataTypes.STRING(36),
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    freight_value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    shipping_limit_date: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'order_items',
    timestamps: false
  });

  // Product Model
  const Product = sequelize.define('Product', {
    product_id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
      allowNull: false
    },
    product_category_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    seller_id: {
      type: DataTypes.STRING(36),
      allowNull: true
    },
    height: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    width: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    length: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    weight: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    }
  }, {
    tableName: 'product',
    timestamps: false
  });

  // Seller Model
  const Seller = sequelize.define('Seller', {
    seller_id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
      allowNull: false
    },
    zip_code: {
      type: DataTypes.STRING(10),
      allowNull: true
    }
  }, {
    tableName: 'Seller',
    timestamps: false
  });

  // Define relationships
  Customer.hasMany(Order, { foreignKey: 'customer_id' });
  Order.belongsTo(Customer, { foreignKey: 'customer_id' });

  Order.hasMany(OrderItem, { foreignKey: 'order_id' });
  OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

  Product.hasMany(OrderItem, { foreignKey: 'product_id' });
  OrderItem.belongsTo(Product, { foreignKey: 'product_id' });

  Seller.hasMany(Product, { foreignKey: 'seller_id' });
  Product.belongsTo(Seller, { foreignKey: 'seller_id' });

  Geolocation.hasMany(Customer, { foreignKey: 'zip_code' });
  Customer.belongsTo(Geolocation, { foreignKey: 'zip_code' });

  Geolocation.hasMany(Seller, { foreignKey: 'zip_code' });
  Seller.belongsTo(Geolocation, { foreignKey: 'zip_code' });

  return {
    Customer,
    Geolocation,
    Order,
    OrderItem,
    Product,
    Seller
  };
};

module.exports = initModels;