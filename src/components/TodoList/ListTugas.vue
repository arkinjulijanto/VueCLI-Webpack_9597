<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium mb-5">To Do List</h3>
        <div class="d-flex align-start">
            <v-card class="mr-3" width="500px">
                <v-card-title>
                    <v-text-field
                        v-model="search"
                        append-icon="mdi-magnify"
                        label="Search"
                        single-line
                        hide-details
                    ></v-text-field>
                    <v-spacer></v-spacer>
                    <v-btn color="success" dark @click="dialog = true">
                        Tambah
                    </v-btn>
                </v-card-title>
                <v-data-table :headers="headers" :items="todos" :search="search" width="200px">
                    <template v-slot:[`item.priority`]="{ item } ">
                        <v-chip v-if="item.priority == 'Penting'"  class="ma-2"  color="red" label outlined>
                            {{ item.priority }}
                        </v-chip>
                        <v-chip v-if="item.priority == 'Biasa'" class="ma-2" color="blue" label outlined>
                            {{ item.priority }}
                        </v-chip>
                        <v-chip v-if="item.priority == 'Tidak penting'" class="ma-2" color="green" label outlined>
                            {{ item.priority }}
                        </v-chip>
                    </template>
                    <template v-slot:[`item.actions`]="{ item }">
                        <v-icon
                            class="mr-2"
                            @click="detail(item)"
                            color="blue"
                        >
                            mdi-file
                        </v-icon>
                    </template>
                    <template v-slot:[`item.checks`]="{item}">
                        <v-checkbox multiple :key="item" @click.capture.stop="pilih(item)"/>              
                    </template>
                </v-data-table>
            </v-card>
            
            <v-card v-if="detailDial == true" class="pt-5 pr-5 pl-5 pb-5">
                <div class="d-flex align-start">
                <h2 class="mr-5">{{ tampTodo.task }}</h2>
                <v-chip v-if="tampTodo.priority == 'Penting'"  class="ma-2"  color="red" label text-color="white">
                        {{ tampTodo.priority }}
                    </v-chip>
                    <v-chip v-if="tampTodo.priority == 'Biasa'" class="ma-2" color="blue" label text-color="white">
                        {{ tampTodo.priority }}
                    </v-chip>
                    <v-chip v-if="tampTodo.priority == 'Tidak penting'" class="ma-2" color="green" label text-color="white">
                        {{ tampTodo.priority }}
                </v-chip>
                </div>
                <p>{{ tampTodo.note }}</p>
                <v-icon
                    class="mr-2"
                    @click="editItem"
                    color="blue"
                >
                    mdi-pencil
                </v-icon>
                <v-icon
                    class="mr-2"
                    @click="deleteItem"
                    color="red"
                >
                    mdi-delete
                </v-icon>
            </v-card>
        </div>    

        <v-card v-if="tempDel.length" class="pa-5 mt-5">
            <p>Delete Multiple : </p>
            <ul v-for="(del, index) in tempDel" :key="index">
                <li>{{ del.task }}</li>
            </ul>
            <v-btn color="red" dark class="mr-2" @click="hapusSemua">
                HAPUS SEMUA 
            </v-btn>
        </v-card>

        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">Form Todo</span>
                </v-card-title>
                <v-card-text>
                    <v-container v-if="activity == 'add'">
                        <v-text-field
                            v-model="formTodo.task"
                            label="Task"
                            required
                        ></v-text-field>

                        <v-select
                            v-model="formTodo.priority"
                            :items="['Penting','Biasa','Tidak penting']"
                            label="Priority"
                            required
                        ></v-select>

                        <v-textarea
                            v-model="formTodo.note"
                            label="Note"
                            required
                        ></v-textarea>
                    </v-container>
                    <v-container v-if="activity == 'edit'">
                        <v-text-field
                            v-model="tempTodo.task"
                            label="Task"
                            required
                        ></v-text-field>

                        <v-select
                            v-model="tempTodo.priority"
                            :items="['Penting','Biasa','Tidak penting']"
                            label="Priority"
                            required
                        ></v-select>

                        <v-textarea
                            v-model="tempTodo.note"
                            label="Note"
                            required
                        ></v-textarea>
                    </v-container>
                     
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cancel">
                        Cancel
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="save">
                        Save
                    </v-btn>

                </v-card-actions>
            </v-card>
        </v-dialog>

         <v-dialog v-model="dialogHapus" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">Yakin ingin menghapus ?</span>
                </v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click="cancel">
                        Tidak
                    </v-btn>
                    <v-btn color="red darken-1" text @click="confirmDelete">
                        Ya
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </v-main>
</template>
<script>
export default {
    name: "List",
    data() {
        return {
            expanded: [],
            detailDial: false,
            search: null,
            dialog: false,
            dialogHapus: false,
            headers: [
                {
                    text: "Task",
                    align: "start",
                    sortable: true,
                    value: "task",
                },
                { text: "Priority", value: "priority" },
                { text: "Actions", value: "actions" },
                { text: "", value: "checks" },
            ],
            todos: [
                {
                    task: "bernafas",
                    priority: "Penting",
                    note: "huffttt",
                },
                {
                    task: "nongkrong",
                    priority: "Tidak penting",
                    note: "bersama tman2",
                },
                {
                    task: "masak",
                    priority: "Biasa",
                    note: "masak air 500ml",
                },
            ],
            formTodo: {
                task: null,
                priority: null,
                note: null,
            },
            activity: "add",
            tempTodo: [],
            tampDetail: [],
            tamp: [],
            tempIndex: -1,
            tempDel: [],
        };
    },
    methods: {
        save() {
            if(this.tempIndex == -1) {
                this.todos.push(this.formTodo);                
            } else {
                Object.assign(this.todos[this.tempIndex], this.tempTodo)
            }
            this.resetForm();
            this.dialog = false;
            this.detailDial = false;
        },
        cancel() {
            this.resetForm();
            this.activity = "add";
            this.dialog = false;
            this.dialogHapus = false;
        },
        resetForm() {
            this.formTodo = {
                task: null,
                priority: null,
                note: null,
            };
        },
        editItem() {
            this.activity = "edit";
            this.dialog = true;
        },
        deleteItem() {
            this.dialogHapus = true;
        },
        confirmDelete() {
            this.todos.splice(this.tempIndex,1);
            this.dialogHapus = false;
            this.detailDial = false;
        },
        detail(item) {
            if (this.detailDial) {
                this.detailDial = false;
            }
            this.tempIndex = this.todos.indexOf(item);
            this.tempTodo = Object.assign({}, item);
            this.tampTodo = Object.assign({}, item);
            this.detailDial = true;
        },
        pilih(item) {
            this.tempDel.includes(item) ? 
                this.tempDel.splice(this.tempDel.indexOf(item), 1) :
                this.tempDel.push(item);                
        },
        hapusSemua() {
            for (var i=0; i < this.tempDel.length; i++) {
                if (this.tampTodo.task == this.tempDel[i].task) {
                    this.tampTodo = {
                        task: null,
                        priority: null,
                        note: null,
                    };
                    this.detailDial = false;
                }
                this.todos.splice(this.todos.indexOf(this.tempDel[i]), 1);
            }
            this.tempDel = [];
        },
    },
};
</script>