<template>
  <div>
    <MaterialNavigation />
    <MaterialDepartementList />
  </div>
</template>

<script>
import MaterialNavigation from "@/components/material/MaterialNavigation";
import MaterialDepartementList from "@/components/material/MaterialDepartementList";

export default {
  name: "MaterialOrder",
  components: {
    MaterialNavigation,
    MaterialDepartementList,
  },
};
</script>
