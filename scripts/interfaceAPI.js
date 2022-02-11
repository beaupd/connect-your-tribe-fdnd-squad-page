class InterfaceMember {
    constructor() {
        this.url = "https://tribe.api.fdnd.nl/v1/member";
        // this.url = "http://127.0.0.1:5000/";
        this.members = [];
        // this.fetch();
        this.memberType = {
            memberId: 0,
            squadId: 0,
            type: "string",
            nickname: "string",
            name: "string",
            prefix: "string",
            surname: "string",
            avatar: "string",
            githubHandle: "string",
            bio: "string",
            url: "string",
        };
    }

    async fetch() {
        const req = await fetch(this.url);
        await req
            .json()
            .then((res) => (this.members = res.data))
            .catch((e) => console.log(`%c${e}`, "color: red"));
    }

    async getUserById(id) {
        return await new Promise((resolve, reject) => {
            if (this.members) {
                this.members.filter((m) => {
                    if (m.memberId == id) {
                        // console.log(`exists ${JSON.stringify(m)}`);
                        resolve(m);
                    }
                });
                reject("Id doesnt exist");
            }
        })
            .then((res) => {
                return res;
            })
            .catch((err) => {
                console.log(`%c${err}`, "color: red");
                return false;
            });
    }

    async patch(data) {
        await this.fetch();
        const memberData = await this.getUserById(data.memberId);
        // console.log(memberData);
        if (memberData) {
            // console.log("member exists");
            for (let d in data) {
                if (Object.prototype.hasOwnProperty.call(data, d)) {
                    // replace values
                    // console.log(`changed ${memberData[d]} to ${data[d]} `);
                    memberData[d] = data[d];
                }
            }
            const xhr = new XMLHttpRequest();
            xhr.open("PATCH", this.url);

            xhr.setRequestHeader("Accept", "application/json");
            xhr.setRequestHeader("Content-Type", "application/json");
            // xhr.setRequestHeader("Access-Control-Allow-Origin", "*");

            xhr.onload = () => {
                if (xhr.status !== 200) {
                    console.log(
                        `%cError ${xhr.status}: ${xhr.statusText}`,
                        "color: red"
                    );
                } else {
                    console.log(`%c${xhr.response}`, "color: green");
                }
            };

            xhr.send(JSON.stringify(data));
        }
        return false;
    }

    async post(data) {
        console.log("posting");
        let valid = true;
        let validation = await new Promise((_, err) => {
            for (let d in this.memberType) {
                if (Object.prototype.hasOwnProperty.call(this.memberType, d)) {
                    // check values exist in data with the membertype
                    if (d != "memberId") {
                        if (!data[d]) {
                            err("Doesn't exist and is needed: " + d);
                        }
                    }
                }
            }
            _("success");
        }).catch((err) => {
            console.log(err);
            valid = false;
        });

        if (valid) {
            console.log("valid");
            const xhr = new XMLHttpRequest();
            xhr.open("POST", this.url);

            xhr.setRequestHeader("Accept", "application/json");
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.setRequestHeader("Access-Control-Allow-Origin", "*");

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    console.log(xhr.status);
                    console.log(xhr.responseText);
                }
            };

            xhr.onload = () => {
                if (xhr.status !== 200) {
                    console.log(
                        `%cError ${xhr.status}: ${xhr.statusText}`,
                        "color: red"
                    );
                } else {
                    console.log(`%c${xhr.response}`, "color: green");
                }
            };

            xhr.send(JSON.stringify(data));
            return;
        }
    }
}
