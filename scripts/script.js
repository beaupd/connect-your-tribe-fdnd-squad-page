const loadSRC = (src) => {
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.src = src;
        img.onload = () => {
            resolve(img);
        };
        img.onerror = () => {
            reject("error");
        };
    });
};

const lazyMember = (member) => {
    return new Promise(async (resolve, reject) => {
        console.log("loading", member.avatar, " of id: ", member.memberId);
        await loadSRC(member.avatar)
            .then((img) => {
                console.log("done Loading", img, "of id: ", member.memberId);
                resolve(img);
            })
            .catch((err) => reject(err));
    });
};

const Cards = {
    index: 0,
    api: new InterfaceMember(),
    cardContainer: document.querySelector("ul.cards"),
    cards: document.querySelectorAll("ul.cards .card"),

    memberElement(member, img) {
        let item = function (value) {
            let span = document.createElement("span");
            span.innerHTML = value;
            let li = document.createElement("li");
            li.appendChild(span);
            return li;
        };
        let listItem = document.createElement("li");
        listItem.classList.add("card");

        let unlistedList = document.createElement("ul");
        member.name &&
            member.surname &&
            unlistedList.appendChild(
                item(
                    member.name + " " + member.prefix == ""
                        ? ""
                        : `${member.prefix} ` + member.surname
                )
            );
        member.type && unlistedList.appendChild(item(member.type));
        member.nickname && unlistedList.appendChild(item(member.nickname));
        member.githubHandle &&
            unlistedList.appendChild(item(member.githubHandle));

        listItem.appendChild(img ? img : this.defaultIMG);
        listItem.appendChild(unlistedList);
        return listItem;
    },
    async getMembers() {
        await this.api.fetch();
        return this.api.members;
    },
    setMember(member, img) {
        // console.log("setting: ", member, " with id: ", member.memberId, "\n");
        // setTimeout(() => {
        if (this.cards[this.index]) {
            this.cards[this.index].replaceWith(this.memberElement(member, img));
            this.index++;
        } else {
            // this.cardContainer.appendChild(this.memberElement(member, img));
            this.cardContainer.insertBefore(
                this.memberElement(member, img),
                this.cardContainer.childNodes[0]
            );
            this.index++;
        }
        // }, Math.random() * 1000 + 1000);
    },
    async LoadMembers() {
        const members = await this.getMembers();
        members.forEach((m) =>
            m.avatar
                ? lazyMember(m)
                      .then((img) => this.setMember(m, img))
                      .catch(() => this.setMember(m))
                : this.setMember(m)
        );
    },
    init() {
        this.LoadMembers();
        this.defaultIMG.src = "assets/user_default.png";
    },
};

Cards.init();
