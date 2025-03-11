<!-- File: src/views/NotAuthorized.vue -->
<template>
    <div class="not-authorized-container">
        <div class="not-authorized-card">
            <div class="icon-container">
                <span class="lock-icon">🔒</span>
            </div>
            <h1 class="title">Access Denied</h1>
            <p class="message">
                You are not authorized to access this application.
                This application is restricted to authorized administrators only.
            </p>
            <button @click="goToLogin" class="return-btn">Return to Login</button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'NotAuthorized',
    methods: {
        goToLogin() {
            this.$router.push('/login');
        }
    }
}
</script>

<style scoped>
.not-authorized-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 20px;
    background-color: #f5f7fa;
}

.not-authorized-card {
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 40px;
    width: 100%;
    max-width: 480px;
    text-align: center;
}

.icon-container {
    margin-bottom: 24px;
}

.lock-icon {
    font-size: 48px;
}

.title {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 16px;
    color: #dc2626;
}

.message {
    font-size: 16px;
    color: #666;
    margin-bottom: 32px;
    line-height: 1.5;
}

.return-btn {
    background-color: #4f46e5;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 12px 24px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.return-btn:hover {
    background-color: #4338ca;
}
</style>