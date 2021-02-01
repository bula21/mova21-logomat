<template>
  <div>
    <MaterialNavigation />
    <OrderMain />
  </div>
</template>

<script>
import MaterialNavigation from "@/components/MaterialNavigation";
import OrderMain from "@/components/OrderMain";

export default {
  name: "Material",
  components: {
    MaterialNavigation,
    OrderMain,
  },
};
</script>
