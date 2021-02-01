<template>
  <div>
    <MaterialNavigation />
    <OrderItemMain :orderId="$route.params.id" />
  </div>
</template>

<script>
import MaterialNavigation from "@/components/MaterialNavigation";
import OrderItemMain from "@/components/OrderItemMain";

export default {
  name: "Order",
  components: {
    MaterialNavigation,
    OrderItemMain,
  },
};
</script>
