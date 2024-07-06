FROM ruby:2.7

WORKDIR /app

COPY Gemfile* ./
RUN bundle install

COPY . .

CMD ["ruby", "app.rb"]
