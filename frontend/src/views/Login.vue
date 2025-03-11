<!-- File: src/views/Login.vue -->
<template>
    <div class="login-container">
        <div class="login-card">
            <div class="logo-container">
                <img src="@/assets/logo.png" alt="Logo" class="logo" />
            </div>
            <h1 class="title">Admin Login</h1>
            <p class="subtitle">Sign in to access the admin dashboard</p>

            <div v-if="error" class="error-message">
                {{ error }}
            </div>

            <a @click="loginWithGoogle" class="google-login-btn">
                <img src="@/assets/google-icon.svg" alt="Google" class="google-icon" />
                <span>Sign in with Google</span>
            </a>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Login',
    data() {
        return {
            error: null
        }
    },
    mounted() {
        // Check if we've been redirected back with an error
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('error')) {
            this.error = 'Authentication failed. Please try again.';
        }
    },
    methods: {
        loginWithGoogle() {
            window.location.href = 'http://localhost:5000/auth/google';
        }
    }
}
</script>

<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 20px;
    background-color: #f5f7fa;
}

.login-card {
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 40px;
    width: 100%;
    max-width: 420px;
    text-align: center;
}

.logo-container {
    margin-bottom: 24px;
}

.logo {
    max-width: 100px;
}

.title {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 8px;
    color: #333;
}

.subtitle {
    font-size: 16px;
    color: #666;
    margin-bottom: 32px;
}

.error-message {
    background-color: #fee2e2;
    color: #dc2626;
    padding: 12px 16px;
    border-radius: 6px;
    margin-bottom: 24px;
    font-size: 14px;
}

.google-login-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 12px 24px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    color: #333;
    text-decoration: none;
}

.google-login-btn:hover {
    background-color: #f3f4f6;
    border-color: #ccc;
}

.google-icon {
    width: 20px;
    height: 20px;
    margin-right: 12px;
}
</style>