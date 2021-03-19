<template>
  <div>
    <MaterialNavigation />
    <MaterialOrderList />
  </div>
</template>

<script>
import MaterialNavigation from "@/components/material/MaterialNavigation";
import MaterialOrderList from "@/components/material/MaterialOrderList";

export default {
  name: "MaterialOrder",
  components: {
    MaterialNavigation,
    MaterialOrderList,
  },
};
</script>
