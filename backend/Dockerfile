FROM ruby:3.0

WORKDIR /app

COPY Gemfile ./
RUN bundle install

COPY . .

CMD ["bundle", "exec", "rackup", "-p", "3000", "-o", "0.0.0.0"]