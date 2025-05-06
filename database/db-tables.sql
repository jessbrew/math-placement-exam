-- Create Table: tests
CREATE TABLE IF NOT EXISTS tests
(
    test_id int NOT NULL PRIMARY KEY,
    test_name varchar(100) NULL,
    time_limit int NULL
);

-----------------------------------------------------------
-- Create Table: question_types
CREATE TABLE IF NOT EXISTS question_types
(
    question_type_id int NOT NULL PRIMARY KEY,
    type_title varchar(200) NULL
);

-----------------------------------------------------------
-- Create Table: questions
CREATE TABLE IF NOT EXISTS questions
(
    question_id int NOT NULL PRIMARY KEY,
    question_text varchar NULL,
    question_type_id int NULL,
    CONSTRAINT fk_questions_question_type_id FOREIGN KEY(question_type_id) REFERENCES question_types(question_type_id)

);

-----------------------------------------------------------
-- Create Table: test_questions
CREATE TABLE IF NOT EXISTS test_questions
(
    test_question_id serial NOT NULL PRIMARY KEY,
    question_id int NOT NULL,
    test_id int NOT NULL,
    CONSTRAINT fk_test_questions_question_id FOREIGN KEY(question_id) REFERENCES questions(question_id),
    CONSTRAINT fk_test_questions_test_id FOREIGN KEY(test_id) REFERENCES tests(test_id)
);

-----------------------------------------------------------
-- Create Table: answers
CREATE TABLE IF NOT EXISTS answers
(
    answer_id serial NOT NULL PRIMARY KEY,
    question_id int NOT NULL,
    answer_text varchar NULL,
    is_correct boolean NULL,
    CONSTRAINT fk_answers_question_id FOREIGN KEY(question_id) REFERENCES questions(question_id)
);

-----------------------------------------------------------
-- Create Table: past_courses
CREATE TABLE IF NOT EXISTS past_courses
(
    past_course_id serial NOT NULL PRIMARY KEY,
    display_order int NULL,
    description varchar(300) NULL
);

-----------------------------------------------------------
-- Create Table: available_courses
CREATE TABLE IF NOT EXISTS available_course
(
    available_course_id serial NOT NULL PRIMARY KEY,
    display_order int NULL,
    description varchar(300) NULL,
    test_id int NULL,
    CONSTRAINT fk_tests_test_id FOREIGN KEY(test_id) REFERENCES tests (test_id)
);

-----------------------------------------------------------
-- Create Table: students
CREATE TABLE IF NOT EXISTS students
(
    student_id bigserial NOT NULL PRIMARY KEY,
    desired_class varchar NULL, 
    email varchar(200) NULL,
    first_name varchar NULL,
    last_name varchar NULL,
    user_code int NULL,
    test_id int NULL,
    inserted_on timestamp(3) without time zone NULL,
    test_completed boolean NULL,
    start_time timestamp(3) without time zone NULL,
    test_evaluated boolean NULL,
    CONSTRAINT fk_tests_test_id FOREIGN KEY(test_id) REFERENCES tests (test_id)
);

ALTER TABLE students ALTER COLUMN inserted_on SET DEFAULT now();
ALTER TABLE students ALTER COLUMN test_completed SET DEFAULT '0';
ALTER TABLE students ALTER COLUMN test_evaluated SET DEFAULT '0';

-----------------------------------------------------------
-- Create Table: student_past_courses
CREATE TABLE IF NOT EXISTS student_past_courses
(
    student_past_course_id serial NOT NULL PRIMARY KEY,
    student_id bigint NULL,
    course_grade varchar(10),
    past_course_id int NULL,
    CONSTRAINT fk_past_courses_past_course_id FOREIGN KEY(past_course_id) REFERENCES past_courses (past_course_id),
    CONSTRAINT fk_student_student_id FOREIGN KEY(student_id) REFERENCES students (student_id)
);

-----------------------------------------------------------
-- Create Table: student_answers
CREATE TABLE IF NOT EXISTS student_answers
(
    student_answer_id bigserial NOT NULL PRIMARY KEY,
    student_id bigint NULL,
    answer_id int NULL,
    time_submitted timestamp(3) without time zone NULL,
    CONSTRAINT fk_answers_answer_id FOREIGN KEY(answer_id) REFERENCES answers (answer_id),
    CONSTRAINT fk_students_student_id FOREIGN KEY(student_id) REFERENCES students (student_id)
);