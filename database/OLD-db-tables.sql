-- Create tests
CREATE TABLE [dbo].[tests](
	[test_id] [int] NOT NULL,
	[test_name] [varchar](100) NULL,
	[time_limit] [int] NULL,
 CONSTRAINT [PK_tests_test_id] PRIMARY KEY CLUSTERED 
(
	[test_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

-- Create question_types
CREATE TABLE [dbo].[question_types](
	[question_type_id] [int] IDENTITY(1,1) NOT NULL,
	[type_title] [varchar](200) NULL,
 CONSTRAINT [PK_question_types_question_type_id] PRIMARY KEY CLUSTERED 
(
	[question_type_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

-- Create questions
CREATE TABLE [dbo].[questions](
	[question_id] [int] IDENTITY(1,1) NOT NULL,
	[question_text] [varchar](max) NULL,
	[question_type] [int] NULL,
 CONSTRAINT [PK_questions_question_id] PRIMARY KEY CLUSTERED 
(
	[question_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

-- Create test_questions
CREATE TABLE [dbo].[test_questions](
	[test_question_id] [int] IDENTITY(1,1) NOT NULL,
	[question_id] [int] NOT NULL,
	[test_id] [int] NOT NULL,
 CONSTRAINT [PK_test_question_id] PRIMARY KEY CLUSTERED 
(
	[test_question_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[test_questions]  WITH CHECK ADD  CONSTRAINT [FK_test_questions_question_id] FOREIGN KEY([question_id])
REFERENCES [dbo].[questions] ([question_id])
GO

ALTER TABLE [dbo].[test_questions] CHECK CONSTRAINT [FK_test_questions_question_id]
GO

ALTER TABLE [dbo].[test_questions]  WITH CHECK ADD  CONSTRAINT [FK_test_questions_test_id] FOREIGN KEY([test_id])
REFERENCES [dbo].[tests] ([test_id])
GO

ALTER TABLE [dbo].[test_questions] CHECK CONSTRAINT [FK_test_questions_test_id]
GO

-- Create answers
CREATE TABLE [dbo].[answers](
	[answer_id] [int] IDENTITY(1,1) NOT NULL,
	[question_id] [int] NOT NULL,
	[answer_text] [varchar](max) NULL,
	[is_correct] [bit] NULL,
 CONSTRAINT [PK_answers_answer_id] PRIMARY KEY CLUSTERED 
(
	[answer_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [dbo].[answers]  WITH CHECK ADD  CONSTRAINT [FK_answers_question_id] FOREIGN KEY([question_id])
REFERENCES [dbo].[questions] ([question_id])
GO

ALTER TABLE [dbo].[answers] CHECK CONSTRAINT [FK_answers_question_id]
GO

-- Create past_courses
CREATE TABLE [dbo].[past_courses](
	[past_course_id] [int] IDENTITY(1,1) NOT NULL,
	[display_order] [int] NULL,
	[description] [varchar](300) NULL,
	[test_type] [varchar](100) NULL,

PRIMARY KEY CLUSTERED 
(
	[past_course_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

-- Create students
CREATE TABLE [dbo].[students](
	[student_id] [bigint] IDENTITY(1,1) NOT NULL,
	[wlc_id] [bigint] NULL,
	[first_name] [varchar](200) NULL,
	[last_name] [varchar](200) NULL,
	[advisor] [varchar](200) NULL,
	[most_advanced_class_taken] [varchar](200) NULL,
	[most_advanced_class_grade] [varchar](10) NULL,
	[desired_class] [varchar](100) NULL,
	[math_in_last_year] [bit] NULL,
	[student_guid][varchar](200) NULL,
	[test_id] [int] NULL,
	[question_id] [int] NULL,
	[inserted_on] [datetime] NULL,
	[test_completed] [bit] NULL,
	[is_active] [bit] NULL,
	[start_time] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[student_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[students] ADD  CONSTRAINT [df_inserted]  DEFAULT (getdate()) FOR [inserted_on]
GO

ALTER TABLE [dbo].[students] ADD  CONSTRAINT [df_completed]  DEFAULT ((0)) FOR [test_completed]
GO

ALTER TABLE [dbo].[students] ADD  DEFAULT ((1)) FOR [is_active]
GO

ALTER TABLE [dbo].[students]  WITH CHECK ADD FOREIGN KEY([question_id])
REFERENCES [dbo].[questions] ([question_id])
GO

ALTER TABLE [dbo].[students]  WITH CHECK ADD FOREIGN KEY([test_id])
REFERENCES [dbo].[tests] ([test_id])
GO

-- Create student_past_courses
CREATE TABLE [dbo].[student_past_courses](
	[student_past_course_id] [int] IDENTITY(1,1) NOT NULL,
	[student_id] [bigint] NULL,
	[past_course_id] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[student_past_course_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[student_past_courses]  WITH CHECK ADD FOREIGN KEY([past_course_id])
REFERENCES [dbo].[past_courses] ([past_course_id])
GO

ALTER TABLE [dbo].[student_past_courses]  WITH CHECK ADD FOREIGN KEY([student_id])
REFERENCES [dbo].[students] ([student_id])
GO

-- student_answers
CREATE TABLE [dbo].[student_answers](
	[student_answer_id] [bigint] IDENTITY(1,1) NOT NULL,
	[student_id] [bigint] NULL,
	[answer_id] [int] NULL,
	[time_submitted] [datetime] NULL
PRIMARY KEY CLUSTERED 
(
	[student_answer_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[student_answers]  WITH CHECK ADD FOREIGN KEY([answer_id])
REFERENCES [dbo].[answers] ([answer_id])
GO

ALTER TABLE [dbo].[student_answers]  WITH CHECK ADD FOREIGN KEY([student_id])
REFERENCES [dbo].[students] ([student_id])
GO