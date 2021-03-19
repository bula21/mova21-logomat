<template>
  <div>
    <MaterialNavigation />
    <MaterialOrderItem :orderId="$route.params.id" />
  </div>
</template>

<script>
import MaterialNavigation from "@/components/material/MaterialNavigation";
import MaterialOrderItem from "@/components/material/MaterialOrderItem";

export default {
  name: "MaterialOrderDetail",
  components: {
    MaterialNavigation,
    MaterialOrderItem,
  },
};
</script>
