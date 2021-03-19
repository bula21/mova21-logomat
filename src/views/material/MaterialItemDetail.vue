<template>
  <div>
    <MaterialNavigation />
    <MaterialItemOrder :itemId="$route.params.id" />
  </div>
</template>

<script>
import MaterialNavigation from "@/components/material/MaterialNavigation";
import MaterialItemOrder from "@/components/material/MaterialItemOrder";

export default {
  name: "MaterialItemDetail",
  components: {
    MaterialNavigation,
    MaterialItemOrder,
  },
};
</script>
