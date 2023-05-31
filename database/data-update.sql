
--  Updating past courses to reference test types
UPDATE past_courses 
SET test_type = 'Trigonometry'
WHERE past_course_id = 1;

UPDATE past_courses 
SET test_type = 'level3'
WHERE past_course_id = 2;
UPDATE past_courses 

SET test_type = 'level4'
WHERE past_course_id = 3;

UPDATE past_courses 
SET test_type = 'Algebra'
WHERE past_course_id = 4;

UPDATE questions  
SET question_text =  REPLACE(q.question_text , '\(', '$');
FROM questions q 

UPDATE questions  
SET question_text =  REPLACE(q.question_text , '\)', '$');
FROM questions q 

UPDATE answers  
SET answer_text  =  REPLACE(a.answer_text  , '\(', '$');
FROM answers a 

UPDATE answers  
SET answer_text  =  REPLACE(a.answer_text  , '\)', '$');
FROM answers a


SELECT * FROM questions q;

SELECT * FROM answers a;

ALTER TABLE students 
ADD start_time DATETIME; 

ALTER TABLE student_answers  
ADD time_submitted DATETIME; 

-- Selecting a test id based on past course Id

--SELECT test_id FROM past_courses pc INNER JOIN tests t ON pc.test_type = t.test_name WHERE past_course_id = 1

-- Updating student based on POST Parameters 

--Update students 
--SET most_advanced_class_taken = 'math', most_advanced_class_grade = 'B', desired_class ='That one', math_in_last_year = 1
--WHERE wlc_id = 1479527;


-- Selecting all test questions for given test id
--SELECT tq.question_id, q.question_text,  a.answer_text 
--                        FROM test_questions tq 
--                        INNER JOIN tests t ON t.test_id = tq.test_id 
--                        INNER JOIN questions q ON q.question_id = tq.question_id
--                        INNER JOIN answers a ON a.question_id = q.question_id 
--                        WHERE t.test_id = 1