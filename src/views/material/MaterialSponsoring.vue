<template>
  <div>
    <MaterialNavigation />
    <MaterialSponsoringList />
  </div>
</template>

<script>
import MaterialNavigation from "@/components/material/MaterialNavigation";
import MaterialSponsoringList from "@/components/material/MaterialSponsoringList";

export default {
  name: "MaterialSponsoring",
  components: {
    MaterialNavigation,
    MaterialSponsoringList,
  },
};
</script>
