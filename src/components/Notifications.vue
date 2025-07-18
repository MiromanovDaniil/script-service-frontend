<template>
  <div class="notifications">
    <transition-group name="fade" tag="div">
      <div v-for="note in notes" :key="note.id" class="note">
        <span class="msg">{{ note.message }}</span>
        <button class="close" @click="remove(note.id)">×</button>
        <div class="bar" :style="{ animationDuration: note.timeout + 'ms' }"></div>
      </div>
    </transition-group>
  </div>
</template>

<script>
import notifications from '@/notifications'
export default {
  name: 'Notifications',
  computed: {
    notes() {
      return notifications.notifications
    },
  },
  methods: {
    remove(id) {
      notifications.remove(id)
    },
  },
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
  position: relative;
  background: linear-gradient(135deg, #d1fae5, #a7f3d0);
  border-left: 4px solid #10b981;
  color: #064e3b;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  overflow: hidden;
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

.bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: #10b981;
  width: 100%;
  animation-name: shrink;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}

@keyframes shrink {
  from {
    width: 100%;
  }
  to {
    width: 0;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
