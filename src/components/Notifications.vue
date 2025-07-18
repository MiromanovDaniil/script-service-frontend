<template>
  <div class="notifications">
    <div v-for="note in notes" :key="note.id" class="note">
      <span class="msg">{{ note.message }}</span>
      <button class="close" @click="remove(note.id)">×</button>
    </div>
  </div>
</template>

<script>
import notifications from '@/notifications'
export default {
  name: 'Notifications',
  computed: {
    notes() {
      return notifications.notifications
    }
  },
  methods: {
    remove(id) {
      notifications.remove(id)
    }
  }
}
</script>

<style scoped>
.notifications {
  position: fixed;
  top: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.note {
  background: #ffffff;
  border: 1px solid #d1d5db;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
}
.msg {
  flex: 1;
}
.close {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}
</style>
