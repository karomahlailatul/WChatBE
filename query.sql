create table users(
id 			    text 	not null,
email 			text 	not null,
password  		text 	not null,
phone 			text 	,
username        text    ,
name 			text    ,
picture 		text 	,
status     		text 	,
verify          text not null ,
created_on 		timestamp default CURRENT_TIMESTAMP not null	,
updated_on 		timestamp default CURRENT_TIMESTAMP not null	,
primary key (id) 
);



CREATE  FUNCTION update_updated_on_users()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_on = now();
    RETURN NEW;
END;
$$ language 'plpgsql';



CREATE TRIGGER update_users_updated_on
    BEFORE UPDATE
    ON
        users
    FOR EACH ROW
EXECUTE PROCEDURE update_updated_on_users();




create table users_verification (
    id text not null ,
    users_id text ,
    token text ,
    created_on timestamp default CURRENT_TIMESTAMP not null	,
    constraint 	users foreign key(users_id) 	references 	users(id) ON DELETE CASCADE,
primary key (id)
)





create table message (
    id text not null ,
    sender text ,
    receiver text ,
    content text ,
    created_on timestamp default CURRENT_TIMESTAMP not null	,
    constraint 	sender  foreign key(sender) 	references 	users(id) ON DELETE CASCADE,
    constraint 	receiver  foreign key(receiver) 	references 	users(id) ON DELETE CASCADE,
primary key (id)
);



create table session (
id text not null ,
users_id text ,
connection text ,
created_on timestamp default CURRENT_TIMESTAMP not null	,
constraint 	users foreign key(users_id) 	references 	users(id) ON DELETE CASCADE,
primary key (id) 
);




create table group_chat (
id text not null ,
owner_id text ,
group_name text ,
group_logo text, 
group_member text[], 
created_on timestamp default CURRENT_TIMESTAMP not null	,
constraint 	owner_id foreign key(owner_id) 	references 	users(id) ON DELETE CASCADE,
primary key (id) 
);


create table message_group (
id text not null ,
sender text ,
content text ,
content_type text ,
group_chat_id text ,
created_on timestamp default CURRENT_TIMESTAMP not null	,
constraint 	sender foreign key(sender) 	references 	users(id) ON DELETE CASCADE,
constraint 	group_chat_id foreign key(group_chat_id) 	references 	group_chat(id) ON DELETE CASCADE,
primary key (id) 
);





