<template>
  <div>
    <MaterialNavigation />
    <MaterialDepartementList />
  </div>
</template>

<script>
import MaterialNavigation from "@/components/MaterialNavigation";
import MaterialDepartementList from "@/components/MaterialDepartementList";

export default {
  name: "MaterialOrder",
  components: {
    MaterialNavigation,
    MaterialDepartementList,
  },
};
</script>
