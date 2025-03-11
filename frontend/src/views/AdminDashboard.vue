<!-- File: src/views/AdminDashboard.vue -->
<template>
    <div class="dashboard-container">
        <header class="dashboard-header">
            <div class="container">
                <div class="header-content">
                    <h1 class="dashboard-title">Admin Dashboard</h1>
                    <div class="user-section" v-if="user">
                        <img :src="user.photo" alt="Profile" class="user-avatar" v-if="user.photo" />
                        <div class="user-info">
                            <p class="user-name">{{ user.displayName }}</p>
                            <p class="user-email">{{ user.email }}</p>
                        </div>
                        <button @click="logout" class="logout-btn">Logout</button>
                    </div>
                </div>
            </div>
        </header>

        <main class="container dashboard-content">
            <div class="welcome-message">
                <h2>Welcome to the Admin Panel</h2>
                <p>You are logged in as an administrator.</p>
            </div>

            <div class="dashboard-cards">
                <div class="dashboard-card">
                    <h3 class="card-title">Users</h3>
                    <p class="card-description">Manage user accounts and permissions.</p>
                    <button class="card-action">Manage Users</button>
                </div>

                <div class="dashboard-card">
                    <h3 class="card-title">Content</h3>
                    <p class="card-description">Edit website content and settings.</p>
                    <button class="card-action">Edit Content</button>
                </div>

                <div class="dashboard-card">
                    <h3 class="card-title">Analytics</h3>
                    <p class="card-description">View website statistics and reports.</p>
                    <button class="card-action">View Reports</button>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'AdminDashboard',
    data() {
        return {
            user: null,
            loading: true,
            error: null
        }
    },
    async mounted() {
        try {
            const response = await axios.get('http://localhost:5000/api/current-user', {
                withCredentials: true
            });

            if (response.data && response.data.user) {
                this.user = {
                    displayName: response.data.user.displayName,
                    email: response.data.user.emails[0].value,
                    photo: response.data.user.photos && response.data.user.photos[0] ? response.data.user.photos[0].value : null
                };
            } else {
                this.$router.push('/login');
            }
        } catch (error) {
            console.error('Error getting user data:', error);
            this.error = 'Failed to load user data';
            this.$router.push('/login');
        } finally {
            this.loading = false;
        }
    },
    methods: {
        async logout() {
            try {
                await axios.get('http://localhost:5000/logout', {
                    withCredentials: true
                });
                this.$router.push('/login');
            } catch (error) {
                console.error('Error logging out:', error);
            }
        }
    }
}
</script>

<style scoped>
.dashboard-container {
    min-height: 100vh;
    background-color: #f5f7fa;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.dashboard-header {
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 16px 0;
    margin-bottom: 32px;
}

.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.dashboard-title {
    font-size: 24px;
    font-weight: 600;
    color: #333;
}

.user-section {
    display: flex;
    align-items: center;
}

.user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 12px;
    object-fit: cover;
}

.user-info {
    margin-right: 16px;
}

.user-name {
    font-weight: 600;
    color: #333;
    font-size: 14px;
}

.user-email {
    color: #666;
    font-size: 12px;
}

.logout-btn {
    background-color: #f3f4f6;
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    font-size: 14px;
    cursor: pointer;
    color: #333;
    font-weight: 500;
    transition: all 0.2s;
}

.logout-btn:hover {
    background-color: #e5e7eb;
}

.dashboard-content {
    padding-bottom: 60px;
}

.welcome-message {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    padding: 24px;
    margin-bottom: 32px;
}

.welcome-message h2 {
    font-size: 20px;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
}

.welcome-message p {
    color: #666;
    font-size: 16px;
}

.dashboard-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;
}

.dashboard-card {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    padding: 24px;
    transition: all 0.3s;
}

.dashboard-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.05);
}

.card-title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
}

.card-description {
    color: #666;
    font-size: 14px;
    margin-bottom: 16px;
}

.card-action {
    background-color: #4f46e5;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    font-size: 14px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s;
}

.card-action:hover {
    background-color: #4338ca;
}
</style>