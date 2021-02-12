<template>
  <div>
    <MaterialNavigation />
    <MaterialOrderItem :orderId="$route.params.id" />
  </div>
</template>

<script>
import MaterialNavigation from "@/components/MaterialNavigation";
import MaterialOrderItem from "@/components/MaterialOrderItem";

export default {
  name: "MaterialOrderDetail",
  components: {
    MaterialNavigation,
    MaterialOrderItem,
  },
};
</script>
