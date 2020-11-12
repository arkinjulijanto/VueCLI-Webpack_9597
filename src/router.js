import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

function importComponent (path) {
    return () => import(`./components/${path}.vue`)
}

Vue.use(VueRouter);

const router = new VueRouter({
    mode: "history",
    routes: [
        {
            path: "/",
            name: "admin",
            component: importComponent('DashboardLayout'),
            children: [
                //dashboard
                {
                    path: "/",
                    name: "Root",
                    component: importComponent('Dashboard'),
                },
                //to do list
                {
                    path: "/gd",
                    name: "Guided",
                    component: importComponent('TodoList/List'),
                },
                //ugede
                {
                    path: "/ugd",
                    name: "UnGuided",
                    component: importComponent('TodoList/ListUGD'),
                },
                //tugas
                {
                    path: "/tgs",
                    name: "Tugas",
                    component: importComponent('TodoList/ListTugas'),
                },
            ]
        },
    ]
});

export default router;