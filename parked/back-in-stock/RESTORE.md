# 到货提醒功能（已暂停 / 未上线）

2026-11 决定「先不做」，因此整套代码从构建里移出，放在这个目录备用。
线上站点**没有任何**相关入口：售罄商品仍然显示灰色的 `Sold out` 按钮。

功能说明与部署步骤见同目录的 `README.md`（原 `docs/back-in-stock.md`）。

## 想恢复时怎么做（共 5 步）

1. 把文件放回原位：

```bash
cp -R parked/back-in-stock/functions ./functions
cp -R parked/back-in-stock/migrations ./migrations
cp parked/back-in-stock/src/components/BackInStockForm.vue src/components/
cp parked/back-in-stock/src/composables/useBackInStock.js src/composables/
cp parked/back-in-stock/src/views/AdminRestockPage.vue src/views/
cp parked/back-in-stock/scripts/devApiPlugin.js scripts/
cp parked/back-in-stock/wrangler.toml.example ./wrangler.toml
```

2. `vite.config.js`：加回 dev 接口 shim

```js
import { devApiPlugin } from './scripts/devApiPlugin.js';
// plugins: [vue(), devApiPlugin()],
```

3. `src/router.js`：加回后台路由（并在顶部 import）

```js
import AdminRestockPage from './views/AdminRestockPage.vue';

{
  path: '/admin/restock',
  name: 'admin-restock',
  component: AdminRestockPage,
},
```

4. `src/components/ProductBuyBar.vue`：售罄时用表单替代按钮
   - import `BackInStockForm`
   - props 增加 `productId`
   - `<button>` 加 `v-if="!product || available"`，并追加：

```vue
<BackInStockForm
  v-else
  class="buy-bar-restock"
  :product-id="props.productId"
  :product-title="product.title"
  :variant-id="selectedVariant.id"
  :variant-title="variantLabel(selectedVariant)"
/>
```

5. 三张卡片（猫窝尺码 `PetBedProductPage.vue`、车载窝颜色 `CarPetSeatPage.vue`、
   猫抓板样式 `CatScratcherFramePage.vue`）：把 `Sold out` 的按钮换成

```vue
<BackInStockForm compact product-id="…" product-title="…" :variant-id="…" :variant-title="…" />
```

`src/views/ProductDetailPage.vue` 里 `ProductBuyBar` 需要补 `:product-id="currentProduct.id"`。

> 也可以直接问我「把到货提醒恢复回来」，我会按这个清单改一遍并跑回归。
