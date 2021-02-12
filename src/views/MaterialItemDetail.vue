<template>
  <div>
    <MaterialNavigation />
    <MaterialItemOrder :itemId="$route.params.id" />
  </div>
</template>

<script>
import MaterialNavigation from "@/components/MaterialNavigation";
import MaterialItemOrder from "@/components/MaterialItemOrder";

export default {
  name: "MaterialItemDetail",
  components: {
    MaterialNavigation,
    MaterialItemOrder,
  },
};
</script>
